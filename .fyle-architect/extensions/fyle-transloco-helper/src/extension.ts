import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface EditOption {
    label: string;
    description: string;
    filePath: string;
    currentValue: string | undefined;
    theme: string; // Changed to string to support any theme/module name
}

interface TranslationAnalysis {
    totalKeys: number;
    missingInCommon: string[];
    missingInFyle: string[];
    missingInCo: string[];
    unusedTranslations: string[];
    coveragePercentage: {
        common: number;
        fyle: number;
        co: number;
    };
}

interface ProjectConfig {
    type: 'integrations-app' | 'fyle-app-v2';
    name: string;
    translationPaths: TranslationPath[];
    sourcePaths: string[];
    hasThemes: boolean;
}

interface TranslationPath {
    key: string;           // 'common', 'fyle', 'co' OR 'shared', 'admin', 'accounts', etc.
    label: string;         // Display name
    filePath: string;      // Absolute path to en.json
    isTheme?: boolean;     // true for theme overrides, false for modules
}

interface TranslationSuggestion {
    value: string;
    confidence: number;
    reason: string;
    examples: string[];
}

interface FileAnalysisCache {
    filePath: string;
    lastModified: Date;
    translationKeys: Set<string>;
    keyUsageMap: Map<string, number[]>; // key -> line numbers where used
    fileSize: number;
    checksum?: string; // Optional: for more robust change detection
}

interface IncrementalAnalysisState {
    isInitialized: boolean;
    lastFullAnalysisTime: Date;
    totalFilesAnalyzed: number;
    pendingFileUpdates: Set<string>;
}


export function activate(context: vscode.ExtensionContext) {
    console.log('Fyle Transloco Helper is now active!');

    const provider = new TranslocoHoverProvider();

    // Create status bar items
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'fyle-transloco.toggleTranslationPreview';
    statusBarItem.text = '$(eye-closed) Translation Preview';
    statusBarItem.tooltip = 'Translation Preview: OFF - Showing keys (Click to turn ON)';
    statusBarItem.show();

    const missingTranslationsStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    missingTranslationsStatusBar.command = 'fyle-transloco.showMissingTranslations';
    missingTranslationsStatusBar.text = '$(loading~spin) Analyzing...';
    missingTranslationsStatusBar.tooltip = 'Click to view missing translations';
    missingTranslationsStatusBar.show();

    // Register hover provider for specific languages separately
    const htmlHoverProvider = vscode.languages.registerHoverProvider(
        { scheme: 'file', language: 'html' },
        provider
    );

    const typescriptHoverProvider = vscode.languages.registerHoverProvider(
        { scheme: 'file', language: 'typescript' },
        provider
    );

    // Register commands
    const refreshCommand = vscode.commands.registerCommand('fyle-transloco.refreshTranslations', () => {
        provider.refreshTranslations();
        vscode.window.showInformationMessage('Translation cache refreshed!');
    });

    const statusCommand = vscode.commands.registerCommand('fyle-transloco.showTranslationFiles', () => {
        provider.showTranslationStatus();
    });

    const editCommand = vscode.commands.registerCommand('fyle-transloco.editTranslation', (key: string) => {
        provider.editTranslation(key);
    });

    const deleteCommand = vscode.commands.registerCommand('fyle-transloco.deleteTranslation', (key: string) => {
        provider.quickDeleteTranslation(key);
    });

    const togglePreviewCommand = vscode.commands.registerCommand('fyle-transloco.toggleTranslationPreview', () => {
        provider.toggleTranslationPreview(statusBarItem);
    });

    const analyzeCommand = vscode.commands.registerCommand('fyle-transloco.analyzeTranslations', () => {
        provider.analyzeTranslations(missingTranslationsStatusBar);
    });

    const analyzeWithValidationCommand = vscode.commands.registerCommand('fyle-transloco.analyzeTranslationsWithValidation', () => {
        provider.analyzeTranslationsWithValidation(missingTranslationsStatusBar);
    });

    const showMissingCommand = vscode.commands.registerCommand('fyle-transloco.showMissingTranslations', () => {
        provider.showMissingTranslationsPopup();
    });

    // Register translation suggestion providers
    const suggestionProvider = new TranslationSuggestionProvider(provider);
    const jsonCompletionProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'json', pattern: '**/i18n/**/*.json' },
        suggestionProvider,
        '"', ':'
    );

    const quickActionProvider = new TranslationQuickActionProvider(provider);
    const codeActionProvider = vscode.languages.registerCodeActionsProvider(
        [{ scheme: 'file', language: 'html' }, { scheme: 'file', language: 'typescript' }],
        quickActionProvider
    );

    // Register command for creating translations
    const createTranslationCommand = vscode.commands.registerCommand('fyle-transloco.createTranslation', (key: string) => {
        provider.createTranslationWithSuggestions(key);
    });

    // Initialize analysis
    provider.initializeAnalysis(missingTranslationsStatusBar);

    // Set up file watchers for translation files and source files
    const translationFileWatchers = provider.setupTranslationFileWatchers(missingTranslationsStatusBar);
    const sourceFileWatchers = provider.setupSourceFileWatchers(missingTranslationsStatusBar);

    context.subscriptions.push(
        htmlHoverProvider,
        typescriptHoverProvider,
        refreshCommand,
        statusCommand,
        editCommand,
        deleteCommand,
        togglePreviewCommand,
        analyzeCommand,
        analyzeWithValidationCommand,
        showMissingCommand,
        jsonCompletionProvider,
        codeActionProvider,
        createTranslationCommand,
        statusBarItem,
        missingTranslationsStatusBar,
        translationFileWatchers,
        sourceFileWatchers
    );
}

class TranslocoHoverProvider implements vscode.HoverProvider {
    private translationCache: Map<string, any> = new Map();
    private lastLoadTime: Date = new Date();
    private lastHoverResult: vscode.Hover | undefined;
    private lastHoverKey: string | undefined;
    private previewMode: boolean = false;
    private decorationType: vscode.TextEditorDecorationType;
    private activeDecorations: Map<string, vscode.DecorationOptions[]> = new Map();
    private analysisCache: TranslationAnalysis | undefined;
    private lastAnalysisTime: Date = new Date();
    private allTranslationKeys: Set<string> = new Set();
    private keyUsageMap: Map<string, string[]> = new Map(); // key -> files where it's used
    private analysisInProgress: boolean = false;
    private analysisTimeoutId: NodeJS.Timeout | undefined;
    private currentAnalysisAbortController: AbortController | undefined;
    private userSelectionHistory: Map<string, string> = new Map(); // key pattern -> selected value
    private validationCache = new Map<string, boolean>(); // Cache validation results: key -> isUsed
    private lastValidationTime: Date | null = null;
    private currentProject: ProjectConfig | null = null;

    // Incremental analysis cache system
    private fileAnalysisCache: Map<string, FileAnalysisCache> = new Map();
    private incrementalAnalysisState: IncrementalAnalysisState = {
        isInitialized: false,
        lastFullAnalysisTime: new Date(),
        totalFilesAnalyzed: 0,
        pendingFileUpdates: new Set()
    };
    private sourceFileWatcher: vscode.FileSystemWatcher | undefined;

    constructor() {
        this.detectProject();
        this.loadAllTranslations();

        // Create decoration type for translation preview
        this.decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                color: '#888888',
                fontStyle: 'italic',
                margin: '0 0 0 10px'
            }
        });

        // Listen for active editor changes to update decorations
        vscode.window.onDidChangeActiveTextEditor(() => {
            if (this.previewMode) {
                this.updateDecorations();
            }
        });

        // Listen for text document changes to update decorations
        vscode.workspace.onDidChangeTextDocument(() => {
            if (this.previewMode) {
                this.updateDecorations();
            }
        });
    }

    provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | undefined {
        let translationKey: string | undefined;
        
        // Check document language type
        const isTypeScript = document.languageId === 'typescript';
        const isHtml = document.languageId === 'html';
        
        if (isHtml) {
            // Get the line and cursor position
            const line = document.lineAt(position.line);
            const lineText = line.text;
            const cursorChar = position.character;

            // Find if cursor is within a quoted string that's part of a transloco expression
            translationKey = this.findTranslationKeyAtPosition(lineText, cursorChar);
        } else if (isTypeScript) {
            // TypeScript: Match translate() calls with or without parameters
            const line = document.lineAt(position.line);
            const lineText = line.text;

            // Updated regex to handle parameters: .translate('key') or .translate('key', { params })
            const translateRegex = /\.translate\s*\(\s*'([^']+)'\s*(?:,\s*\{[^}]*\})?\s*\)/g;
            let match;

            while ((match = translateRegex.exec(lineText)) !== null) {
                const keyStart = match.index + match[0].indexOf("'") + 1;
                const keyEnd = keyStart + match[1].length;

                // Check if cursor is within this specific translation key
                if (position.character >= keyStart && position.character <= keyEnd) {
                    translationKey = match[1];
                    break;
                }
            }
        }
        
        if (!translationKey) {
            this.lastHoverKey = undefined;
            this.lastHoverResult = undefined;
            return;
        }
        
        // Prevent duplicate results for the same key
        if (this.lastHoverKey === translationKey && this.lastHoverResult) {
            return this.lastHoverResult;
        }
        
        // Create new hover content
        const hoverResult = this.createHoverContent(translationKey);
        this.lastHoverKey = translationKey;
        this.lastHoverResult = hoverResult;
        
        return hoverResult;
    }

    refreshTranslations(): void {
        console.log(`🔄 REFRESH START: Clearing translation cache for ${this.currentProject?.name || 'unknown project'}`);
        this.translationCache.clear();

        console.log(`🔄 REFRESH: Loading all translations for ${this.currentProject?.type || 'unknown type'}`);
        this.loadAllTranslations();

        // Clear analysis cache to trigger re-analysis
        this.analysisCache = undefined;

        // DON'T clear validation cache when translations are refreshed
        // Validation cache tracks if keys are used in SOURCE CODE, which doesn't change when translation files change
        console.log('🔄 REFRESH COMPLETE: Translation cache refreshed, validation cache preserved');

        // Debug: Show cache status
        console.log(`🔍 CACHE STATUS: ${this.translationCache.size} translation files loaded`);
        for (const [key, value] of this.translationCache.entries()) {
            const keyCount = this.countKeysInObject(value);
            console.log(`   📁 ${key}: ${keyCount} keys`);
        }

        // IMPORTANT: Refresh preview decorations if preview mode is active
        if (this.previewMode) {
            console.log('🔄 PREVIEW: Refreshing translation preview decorations with new values');
            this.updateDecorations();
        }
    }

    /**
     * Detect which project type we're working with and configure accordingly
     */
    private detectProject(): void {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            console.warn('No workspace folder found for project detection');
            return;
        }

        const workspacePath = workspaceFolder.uri.fsPath;
        const fs = require('fs');
        const path = require('path');

        // Check for integrations-app structure (current)
        const integrationsI18nPath = path.join(workspacePath, 'src/assets/i18n');
        const integrationsCommonFile = path.join(integrationsI18nPath, 'en.json');
        const integrationsFyleFile = path.join(integrationsI18nPath, 'fyle/en.json');
        const integrationsCoFile = path.join(integrationsI18nPath, 'co/en.json');

        if (fs.existsSync(integrationsCommonFile) &&
            (fs.existsSync(integrationsFyleFile) || fs.existsSync(integrationsCoFile))) {

            this.currentProject = {
                type: 'integrations-app',
                name: 'Fyle Integrations App',
                hasThemes: true,
                sourcePaths: ['src/app/**/*.{html,ts}'],
                translationPaths: [
                    {
                        key: 'common',
                        label: 'Common (en.json)',
                        filePath: integrationsCommonFile,
                        isTheme: true
                    },
                    {
                        key: 'fyle',
                        label: 'Fyle Theme (fyle/en.json)',
                        filePath: integrationsFyleFile,
                        isTheme: true
                    },
                    {
                        key: 'co',
                        label: 'Capital One Theme (co/en.json)',
                        filePath: integrationsCoFile,
                        isTheme: true
                    }
                ]
            };

            console.log('🎯 PROJECT: Detected Fyle Integrations App (multi-theme)');
            return;
        }

        // Check for fyle-app-v2 structure (new)
        const appV2Paths = [
            'app-v2/libs/shared/assets/i18n/en.json',
            'app-v2/apps/admin/src/assets/i18n/en.json',
            'app-v2/apps/accounts/src/assets/i18n/en.json',
            'app-v2/apps/spender/src/assets/i18n/en.json',
            'app-v2/apps/approver/src/assets/i18n/en.json',
            'app-v2/apps/settings/src/assets/i18n/en.json',
            'app-v2/apps/developers/src/assets/i18n/en.json'
        ];

        const existingAppV2Paths = appV2Paths.filter(relativePath => {
            const fullPath = path.join(workspacePath, relativePath);
            return fs.existsSync(fullPath);
        });

        if (existingAppV2Paths.length > 0) {
            this.currentProject = {
                type: 'fyle-app-v2',
                name: 'Fyle App V2',
                hasThemes: false,
                sourcePaths: ['app-v2/**/*.{html,ts}'],
                translationPaths: existingAppV2Paths.map(relativePath => {
                    const fullPath = path.join(workspacePath, relativePath);
                    const moduleName = this.extractModuleName(relativePath);

                    return {
                        key: moduleName,
                        label: `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Module`,
                        filePath: fullPath,
                        isTheme: false
                    };
                })
            };

            console.log(`🎯 PROJECT: Detected Fyle App V2 (${existingAppV2Paths.length} modules)`);
            return;
        }

        // Fallback to integrations-app if no clear detection
        console.warn('⚠️ PROJECT: Could not detect project type, defaulting to integrations-app');
        this.currentProject = {
            type: 'integrations-app',
            name: 'Unknown Project (integrations-app mode)',
            hasThemes: true,
            sourcePaths: ['src/app/**/*.{html,ts}'],
            translationPaths: []
        };
    }

    /**
     * Extract module name from app-v2 path
     */
    private extractModuleName(relativePath: string): string {
        if (relativePath.includes('libs/shared')) {
            return 'shared';
        }

        const match = relativePath.match(/apps\/([^\/]+)\//);
        return match ? match[1] : 'unknown';
    }

    /**
     * Get project-specific search paths for ripgrep
     */
    private getProjectSearchPaths(workspacePath: string): string[] {
        const path = require('path');

        if (!this.currentProject) {
            // Fallback to default
            return [path.join(workspacePath, 'src', 'app')];
        }

        const searchPaths: string[] = [];

        for (const sourcePath of this.currentProject.sourcePaths) {
            // Convert glob pattern to actual directory path
            // e.g., 'src/app/**/*.{html,ts}' -> 'src/app'
            // e.g., 'app-v2/**/*.{html,ts}' -> 'app-v2'
            const basePath = sourcePath.split('/**')[0];
            const fullPath = path.join(workspacePath, basePath);
            searchPaths.push(fullPath);
        }

        return searchPaths;
    }

    /**
     * Get project-specific translation file patterns for file watching
     */
    private getTranslationFilePatterns(): string[] {
        if (!this.currentProject) {
            return ['src/assets/i18n/**/*.json']; // Default fallback
        }

        if (this.currentProject.type === 'integrations-app') {
            return ['src/assets/i18n/**/*.json'];
        } else if (this.currentProject.type === 'fyle-app-v2') {
            return [
                'app-v2/libs/shared/assets/i18n/**/*.json',
                'app-v2/apps/*/src/assets/i18n/**/*.json'
            ];
        }

        return ['**/**/assets/i18n/**/*.json']; // Generic fallback
    }

    /**
     * Get all translations for a key across all loaded translation files
     */
    private getTranslationsForKey(key: string): Array<{key: string, label: string, value: string | undefined, isTheme?: boolean}> {
        if (!this.currentProject) {
            return [];
        }

        const translations: Array<{key: string, label: string, value: string | undefined, isTheme?: boolean}> = [];

        for (const translationPath of this.currentProject.translationPaths) {
            const translationData = this.translationCache.get(translationPath.key);
            const value = this.getNestedValue(translationData, key);

            translations.push({
                key: translationPath.key,
                label: translationPath.label,
                value: value,
                isTheme: translationPath.isTheme
            });
        }

        return translations.filter(t => t.value !== undefined);
    }

    /**
     * Add hover content for integrations app (theme-based)
     */
    private addIntegrationsAppHoverContent(markdownContent: vscode.MarkdownString, translations: Array<{key: string, label: string, value: string | undefined, isTheme?: boolean}>, highlightOverrides: boolean): void {
        // Find common and theme translations dynamically
        const common = translations.find(t => t.key === 'common');
        const themes = translations.filter(t => t.isTheme);

        // Check if it's a common translation (same for all themes)
        const allThemesHaveSameValue = themes.length > 0 && themes.every(theme => theme.value === common?.value);

        if (allThemesHaveSameValue && common?.value) {
            markdownContent.appendMarkdown(`📄 **Common (All Themes):** ${common.value}\n\n`);
        } else {
            // Show theme-specific differences
            for (const theme of themes) {
                if (theme.value) {
                    const isOverride = theme.value !== common?.value;
                    const themeIcon = this.getThemeIcon(theme.key);
                    const icon = isOverride && highlightOverrides ? '🔄' : themeIcon;
                    const themeName = theme.key.charAt(0).toUpperCase() + theme.key.slice(1);
                    markdownContent.appendMarkdown(`${icon} **${themeName}${isOverride ? ' (Override)' : ''}:** ${theme.value}\n\n`);
                }
            }

            // Show common fallback if different from theme versions
            if (common?.value && themes.some(theme => theme.value !== common.value)) {
                markdownContent.appendMarkdown(`📋 **Common Fallback:** ${common.value}\n\n`);
            }
        }
    }

    /**
     * Add hover content for fyle app v2 (module-based)
     */
    private addFyleAppV2HoverContent(markdownContent: vscode.MarkdownString, translations: Array<{key: string, label: string, value: string | undefined, isTheme?: boolean}>): void {
        for (const translation of translations) {
            const icon = this.getModuleIcon(translation.key);
            markdownContent.appendMarkdown(`${icon} **${translation.label}:** ${translation.value}\n\n`);
        }
    }

    /**
     * Add generic hover content
     */
    private addGenericHoverContent(markdownContent: vscode.MarkdownString, translations: Array<{key: string, label: string, value: string | undefined, isTheme?: boolean}>): void {
        for (const translation of translations) {
            markdownContent.appendMarkdown(`📝 **${translation.label}:** ${translation.value}\n\n`);
        }
    }

    /**
     * Get icon for module type
     */
    private getModuleIcon(moduleKey: string): string {
        switch (moduleKey) {
            case 'shared': return '🔗';
            case 'admin': return '👑';
            case 'accounts': return '💼';
            case 'spender': return '💳';
            case 'approver': return '✅';
            case 'settings': return '⚙️';
            case 'developers': return '👨‍💻';
            default: return '📦';
        }
    }

    showTranslationStatus(): void {
        if (!this.currentProject) {
            vscode.window.showErrorMessage('No project configuration found');
            return;
        }

        const status = this.currentProject.translationPaths.map(translationPath => {
            const exists = require('fs').existsSync(translationPath.filePath);
            const isLoaded = this.translationCache.has(translationPath.key);
            const statusText = exists ? (isLoaded ? 'Loaded' : 'Error') : 'Not Found';
            const icon = exists ? '✅' : '❌';
            return `${translationPath.label}: ${icon} ${statusText}`;
        }).join('\n');

        const projectInfo = `Project: ${this.currentProject.name} (${this.currentProject.type})`;
        vscode.window.showInformationMessage(`Translation Files Status:\n\n${projectInfo}\n\n${status}\n\nLast loaded: ${this.lastLoadTime.toLocaleTimeString()}`);
    }

    async editTranslation(key: string): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        try {
            // Determine edit options
            const editOptions = this.getEditOptions(key);

            if (editOptions.length === 0) {
                vscode.window.showErrorMessage('No translation files available for editing');
                return;
            }

            // Show improved modal dialog
            await this.showTranslationEditModal(key, editOptions);

        } catch (error) {
            vscode.window.showErrorMessage(`Error editing translation: ${error}`);
        }
    }

    private async deleteTranslation(key: string, selectedOption: EditOption): Promise<void> {
        // Show confirmation dialog
        const themeIcon = this.getThemeIcon(selectedOption.theme);
        const confirmation = await vscode.window.showWarningMessage(
            `${themeIcon} Delete Translation Key`,
            {
                modal: true,
                detail: `Are you sure you want to delete the key "${key}" from ${selectedOption.label}?\n\nThis will completely remove the key-value pair and cannot be undone.\n\nCurrent value: "${selectedOption.currentValue || 'No value set'}"`
            },
            'Delete'
        );

        if (confirmation !== 'Delete') {
            return; // User cancelled
        }

        try {
            // Delete the key from the JSON file
            await this.deleteTranslationKey(selectedOption.filePath, key);
            this.refreshTranslations();

            // Run validation analysis after deletion to update unused count
            console.log('🔄 TRANSLATION DELETE: Running validation analysis to update unused count');
            setTimeout(() => {
                this.calculateTranslationCoverageWithValidation().then((validatedAnalysis) => {
                    // IMPORTANT: Update the analysis cache with validated results
                    this.analysisCache = validatedAnalysis;
                    this.lastAnalysisTime = new Date();
                    console.log('✅ TRANSLATION DELETE: Validation analysis completed and cache updated');
                });
            }, 100); // Small delay to ensure refresh completes

            // Show success message
            vscode.window.showInformationMessage(
                `${themeIcon} Translation key "${key}" deleted successfully from ${selectedOption.label}`,
                { modal: false }
            );
        } catch (error) {
            vscode.window.showErrorMessage(`Error deleting translation: ${error}`);
        }
    }

    async quickDeleteTranslation(key: string): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        try {
            // Determine which files have this key
            const editOptions = this.getEditOptions(key);
            // For deletion, include options with empty values too (they still exist in the file)
            const availableOptions = editOptions.filter(option => option.currentValue !== undefined && option.currentValue !== null);

            if (availableOptions.length === 0) {
                const fileType = this.currentProject?.type === 'fyle-app-v2' ? 'module files' : 'theme files';
                vscode.window.showWarningMessage(`Translation key "${key}" not found in any ${fileType}`);
                return;
            }

            let selectedOption: EditOption;

            if (availableOptions.length === 1) {
                selectedOption = availableOptions[0];
            } else {
                // Show quick selection for which theme to delete from
                const deleteItems = availableOptions.map((option) => {
                    const themeIcon = this.getThemeIcon(option.theme);
                    const currentValue = option.currentValue || '';
                    const displayValue = currentValue === '' ? '(empty)' : currentValue;
                    const truncatedValue = displayValue.length > 50 ? displayValue.substring(0, 47) + '...' : displayValue;

                    return {
                        label: `${themeIcon} Delete from ${option.label}`,
                        description: `Remove key from ${option.description.toLowerCase()}`,
                        detail: `Current: ${truncatedValue}`,
                        option: option
                    };
                });

                const picked = await vscode.window.showQuickPick(deleteItems, {
                    placeHolder: `🗑️ Select which theme to delete "${key}" from`,
                    title: `🗑️ Quick Delete Translation`,
                    ignoreFocusOut: true,
                    matchOnDescription: true,
                    matchOnDetail: true,
                    canPickMany: false
                });

                if (!picked) {
                    return; // User cancelled
                }

                selectedOption = (picked as any).option;
            }

            // Show confirmation and delete
            await this.deleteTranslation(key, selectedOption);

        } catch (error) {
            vscode.window.showErrorMessage(`Error deleting translation: ${error}`);
        }
    }

    private async showTranslationEditModal(key: string, editOptions: EditOption[]): Promise<void> {
        // Step 1: Show theme selection with improved modal-style quick pick
        let selectedOption: EditOption;

        if (editOptions.length === 1) {
            selectedOption = editOptions[0];
        } else {
            const themeItems = editOptions.map((option) => {
                const themeIcon = this.getThemeIcon(option.theme);
                const currentValue = option.currentValue || 'No value set';
                const truncatedValue = currentValue.length > 50 ? currentValue.substring(0, 47) + '...' : currentValue;

                return {
                    label: `${themeIcon} ${option.label}`,
                    description: option.description,
                    detail: `Current: "${truncatedValue}"`,
                    option: option
                };
            });

            const fileType = this.currentProject?.type === 'fyle-app-v2' ? 'module file' : 'theme file';
            const picked = await vscode.window.showQuickPick(themeItems, {
                placeHolder: `🎯 Select which ${fileType} to edit for key: ${key}`,
                title: `🔤 Edit Translation`,
                ignoreFocusOut: true, // Keep popup open even when clicking outside
                matchOnDescription: true,
                matchOnDetail: true,
                canPickMany: false
            });

            if (!picked) {
                return; // User cancelled
            }

            selectedOption = (picked as any).option;
        }


        // Step 2: Show enhanced input box for editing the value
        const currentValue = selectedOption.currentValue || '';
        const themeIcon = this.getThemeIcon(selectedOption.theme);

        const newValue = await vscode.window.showInputBox({
            title: `${themeIcon} Edit Translation in ${selectedOption.label}`,
            prompt: `Key: ${key} | File:${selectedOption.label}`,
            value: currentValue,
            placeHolder: 'Enter the new translation value... (Tip: Use Ctrl+A to select all)',
            ignoreFocusOut: true, // Keep popup open even when clicking outside
            password: false,
            validateInput: (value) => {
                const trimmed = value.trim();
                if (!trimmed) {
                    return '❌ Translation value cannot be empty';
                }
                if (trimmed === currentValue) {
                    return '⚠️ Value unchanged - enter a new translation';
                }
                if (trimmed.length > 500) {
                    return '⚠️ Translation value is too long (max 500 characters)';
                }
                return null; // Valid input
            }
        });

        if (newValue === undefined) {
            return; // User cancelled
        }

        // Step 3: Save the translation
        try {
            await this.updateTranslationFile(selectedOption.filePath, key, newValue);
            this.refreshTranslations();

            // Run validation analysis after edit to update unused count
            console.log('🔄 TRANSLATION EDIT: Running validation analysis to update unused count');
            setTimeout(() => {
                this.calculateTranslationCoverageWithValidation().then((validatedAnalysis) => {
                    // IMPORTANT: Update the analysis cache with validated results
                    this.analysisCache = validatedAnalysis;
                    this.lastAnalysisTime = new Date();
                    console.log('✅ TRANSLATION EDIT: Validation analysis completed and cache updated');
                });
            }, 100); // Small delay to ensure refresh completes

            // Show success with theme icon
            vscode.window.showInformationMessage(
                `${themeIcon} Translation updated successfully in ${selectedOption.label}`,
                { modal: false }
            );
        } catch (error) {
            vscode.window.showErrorMessage(`Error updating translation: ${error}`);
        }
    }



    private getThemeIcon(theme: string): string {
        // Integrations app themes
        switch (theme) {
            case 'common':
                return '📄';
            case 'fyle':
                return '🟣';
            case 'co':
                return '🔵';
            // Fyle app v2 modules
            case 'shared':
                return '🔗';
            case 'admin':
                return '👑';
            case 'accounts':
                return '💼';
            case 'spender':
                return '💳';
            case 'approver':
                return '✅';
            case 'settings':
                return '⚙️';
            case 'developers':
                return '👨‍💻';
            default:
                return '📝';
        }
    }

    private loadAllTranslations(): void {
        if (!this.currentProject) {
            console.warn('No project configuration found, cannot load translations');
            return;
        }

        console.log(`📚 LOADING: ${this.currentProject.name} translations...`);

        // Load all translation files based on project configuration
        for (const translationPath of this.currentProject.translationPaths) {
            this.loadTranslationFile(translationPath.filePath, translationPath.key);
        }

        this.lastLoadTime = new Date();
        console.log(`✅ LOADED: ${this.currentProject.translationPaths.length} translation files for ${this.currentProject.name}`);
    }

    private loadTranslationFile(filePath: string, theme: string): void {
        try {
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const translations = JSON.parse(content);
                this.translationCache.set(theme, translations);

                // Count keys for debugging
                const keyCount = this.countKeysInObject(translations);
                console.log(`✅ LOADED: ${theme} translations from ${filePath} (${keyCount} keys)`);

                // Debug: Show sample keys for app-v2
                if (this.currentProject?.type === 'fyle-app-v2' && keyCount > 0) {
                    const sampleKeys = this.getSampleKeys(translations, 3);
                    console.log(`🔍 SAMPLE KEYS in ${theme}:`, sampleKeys);
                }
            } else {
                console.log(`⚠️ NOT FOUND: Translation file ${filePath}`);
                this.translationCache.set(theme, {});
            }
        } catch (error) {
            console.error(`❌ ERROR: Loading ${theme} translations from ${filePath}:`, error);
            this.translationCache.set(theme, {});
        }
    }

    /**
     * Count total keys in a nested object
     */
    private countKeysInObject(obj: any, prefix: string = ''): number {
        let count = 0;
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    count += this.countKeysInObject(obj[key], prefix ? `${prefix}.${key}` : key);
                } else {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Get sample keys from translation object for debugging
     */
    private getSampleKeys(obj: any, limit: number = 3): string[] {
        const keySet = new Set<string>();
        this.extractAllKeysFromObject(obj, '', keySet);
        return Array.from(keySet).slice(0, limit);
    }

    /**
     * Get project-specific coverage message for completion dialog
     */
    private getProjectSpecificCoverageMessage(analysis: TranslationAnalysis): string {
        if (!this.currentProject) {
            return `Coverage: ${analysis.coveragePercentage.common}%`;
        }

        if (this.currentProject.type === 'integrations-app') {
            return `Coverage: Common ${analysis.coveragePercentage.common}%, Fyle ${analysis.coveragePercentage.fyle}%, CO ${analysis.coveragePercentage.co}%`;
        } else if (this.currentProject.type === 'fyle-app-v2') {
            const moduleCount = this.currentProject.translationPaths.length;
            return `Project: ${this.currentProject.name} (${moduleCount} modules)\nAll translation keys are available across modules`;
        }

        return `Project: ${this.currentProject.name}\nAll translations complete`;
    }

    private getTranslationForTheme(key: string, theme: 'fyle' | 'co'): string | undefined {
        // This method is kept for backward compatibility with integrations-app only
        // First check theme-specific override
        const themeTranslations = this.translationCache.get(theme);
        const themeValue = this.getNestedValue(themeTranslations, key);

        if (themeValue) {
            return themeValue;
        }

        // Fallback to common translation
        const commonTranslations = this.translationCache.get('common');
        return this.getNestedValue(commonTranslations, key);
    }

    /**
     * Get translation value from any translation file/module dynamically
     */
    private getTranslationFromAnySource(key: string, sourceKey: string): string | undefined {
        const translations = this.translationCache.get(sourceKey);
        return this.getNestedValue(translations, key);
    }

    /**
     * Get translation value with project-aware fallback logic
     */
    private getTranslationWithFallback(key: string, primarySource: string): string | undefined {
        if (!this.currentProject) return undefined;

        // First try the primary source
        const primaryValue = this.getTranslationFromAnySource(key, primarySource);
        if (primaryValue) return primaryValue;

        // For integrations-app, fallback to common
        if (this.currentProject.type === 'integrations-app' && primarySource !== 'common') {
            return this.getTranslationFromAnySource(key, 'common');
        }

        // For fyle-app-v2, no fallback (modules are independent)
        return undefined;
    }

    private createHoverContent(key: string): vscode.Hover {
        const config = vscode.workspace.getConfiguration('fyle-transloco');
        const showSourceInfo = config.get('showSourceInfo', true);
        const highlightOverrides = config.get('highlightOverrides', true);
        
        const markdownContent = new vscode.MarkdownString();
        markdownContent.isTrusted = true;
        
        markdownContent.appendMarkdown(`**🔤 Translation Key:** \`${key}\` [✏️ Edit](command:fyle-transloco.editTranslation?${encodeURIComponent(JSON.stringify([key]))}) [🗑️ Delete](command:fyle-transloco.deleteTranslation?${encodeURIComponent(JSON.stringify([key]))})\n\n`);
        
        // Get translations dynamically based on project type
        const translations = this.getTranslationsForKey(key);

        // Check if translation exists at all
        if (translations.length === 0) {
            markdownContent.appendMarkdown(`❌ **Translation not found**\n\n`);
            markdownContent.appendMarkdown(`*Make sure the key exists in your translation files*`);
            return new vscode.Hover(markdownContent);
        }
        
        // Show translations dynamically based on project type
        if (this.currentProject?.type === 'integrations-app') {
            // Theme-based display for integrations app
            this.addIntegrationsAppHoverContent(markdownContent, translations, highlightOverrides);
        } else if (this.currentProject?.type === 'fyle-app-v2') {
            // Module-based display for fyle app v2
            this.addFyleAppV2HoverContent(markdownContent, translations);
        } else {
            // Generic display
            this.addGenericHoverContent(markdownContent, translations);
        }
        
        // Show source information
        if (showSourceInfo) {
            const sourceInfo = this.getTranslationSource(key);
            markdownContent.appendMarkdown(`---\n*📁 Source: ${sourceInfo}*`);
        }

        return new vscode.Hover(markdownContent);
    }

    private getTranslationSource(key: string): string {
        if (!this.currentProject) {
            return 'No project configuration';
        }

        if (this.currentProject.type === 'integrations-app') {
            return this.getIntegrationsAppSource(key);
        } else if (this.currentProject.type === 'fyle-app-v2') {
            return this.getFyleAppV2Source(key);
        }

        return this.getGenericSource(key);
    }

    /**
     * Get source information for integrations app (theme-based)
     */
    private getIntegrationsAppSource(key: string): string {
        if (!this.currentProject) return 'No project configuration';

        const foundSources: string[] = [];
        let commonValue: string | undefined;
        let commonLabel = '';

        // Check all translation paths dynamically
        for (const translationPath of this.currentProject.translationPaths) {
            const value = this.getNestedValue(this.translationCache.get(translationPath.key), key);
            if (value) {
                foundSources.push(translationPath.label);

                // Track common translation
                if (translationPath.key === 'common') {
                    commonValue = value;
                    commonLabel = translationPath.label;
                }
            }
        }

        if (foundSources.length === 0) {
            return 'Translation not found';
        }

        // Check for overrides vs common
        const themeOverrides = foundSources.filter(source => source !== commonLabel);

        if (themeOverrides.length > 1 && commonValue) {
            return `${themeOverrides.join(' and ')} override common`;
        } else if (themeOverrides.length === 1 && commonValue) {
            return `${themeOverrides[0]} overrides common`;
        } else if (foundSources.length === 1) {
            return foundSources[0];
        } else {
            return `Found in: ${foundSources.join(', ')}`;
        }
    }

    /**
     * Get source information for fyle app v2 (module-based)
     */
    private getFyleAppV2Source(key: string): string {
        const foundModules: string[] = [];

        for (const translationPath of this.currentProject!.translationPaths) {
            const value = this.getNestedValue(this.translationCache.get(translationPath.key), key);
            if (value) {
                foundModules.push(translationPath.label);
            }
        }

        if (foundModules.length === 0) {
            return 'Translation not found in any module';
        } else if (foundModules.length === 1) {
            return foundModules[0];
        } else {
            return `Found in ${foundModules.length} modules: ${foundModules.join(', ')}`;
        }
    }

    /**
     * Get generic source information
     */
    private getGenericSource(key: string): string {
        if (!this.currentProject) return 'No project configuration';

        const foundSources: string[] = [];

        for (const translationPath of this.currentProject.translationPaths) {
            const value = this.getNestedValue(this.translationCache.get(translationPath.key), key);
            if (value) {
                foundSources.push(translationPath.label);
            }
        }

        if (foundSources.length === 0) {
            return 'Translation not found';
        } else if (foundSources.length === 1) {
            return foundSources[0];
        } else {
            return `Found in: ${foundSources.join(', ')}`;
        }
    }

    private getNestedValue(obj: any, key: string): string | undefined {
        if (!obj) return undefined;
        return key.split('.').reduce((o, k) => o?.[k], obj);
    }

    private getEditOptions(key: string): EditOption[] {
        if (!this.currentProject) {
            console.warn('No project configuration found for edit options');
            return [];
        }

        const options: EditOption[] = [];
        const fs = require('fs');

        // Generate edit options based on project configuration
        for (const translationPath of this.currentProject.translationPaths) {
            if (fs.existsSync(translationPath.filePath)) {
                const currentValue = this.getNestedValue(this.translationCache.get(translationPath.key), key);

                options.push({
                    label: translationPath.label,
                    description: this.getEditDescription(translationPath),
                    filePath: translationPath.filePath,
                    currentValue: currentValue,
                    theme: translationPath.key
                });
            }
        }

        return options;
    }

    /**
     * Get description for edit option based on project type
     */
    private getEditDescription(translationPath: TranslationPath): string {
        if (this.currentProject?.type === 'integrations-app') {
            if (translationPath.key === 'common') {
                return 'Edit the common translation (affects both themes)';
            } else if (translationPath.isTheme) {
                return `Edit ${translationPath.key}-specific override`;
            }
        } else if (this.currentProject?.type === 'fyle-app-v2') {
            return `Edit translation in ${translationPath.key} module`;
        }

        return `Edit translation in ${translationPath.label}`;
    }

    private async updateTranslationFile(filePath: string, key: string, value: string): Promise<void> {
        try {
            // Read current file content
            let translations: any = {};
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                translations = JSON.parse(content);
            }

            // Set the nested value
            this.setNestedValue(translations, key, value);

            // Write back to file with proper formatting
            const jsonContent = JSON.stringify(translations, null, 2);
            fs.writeFileSync(filePath, jsonContent, 'utf8');

        } catch (error) {
            throw new Error(`Failed to update translation file: ${error}`);
        }
    }

    private setNestedValue(obj: any, key: string, value: string): void {
        const keys = key.split('.');
        let current = obj;

        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!(k in current) || typeof current[k] !== 'object' || current[k] === null) {
                current[k] = {};
            }
            current = current[k];
        }

        current[keys[keys.length - 1]] = value;
    }

    private async deleteTranslationKey(filePath: string, key: string): Promise<void> {
        try {
            // Read current file content
            if (!fs.existsSync(filePath)) {
                throw new Error(`Translation file not found: ${filePath}`);
            }

            const content = fs.readFileSync(filePath, 'utf8');
            const translations = JSON.parse(content);

            // Delete the nested key
            this.deleteNestedKey(translations, key);

            // Write back to file with proper formatting
            const jsonContent = JSON.stringify(translations, null, 2);
            fs.writeFileSync(filePath, jsonContent, 'utf8');

        } catch (error) {
            throw new Error(`Failed to delete translation key: ${error}`);
        }
    }

    private deleteNestedKey(obj: any, key: string): boolean {
        const keys = key.split('.');

        // Navigate to the parent object
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!(k in current) || typeof current[k] !== 'object' || current[k] === null) {
                return false; // Key path doesn't exist
            }
            current = current[k];
        }

        // Delete the final key
        const finalKey = keys[keys.length - 1];
        if (finalKey in current) {
            delete current[finalKey];

            // Clean up empty parent objects (optional - removes empty nested objects)
            this.cleanupEmptyObjects(obj, keys.slice(0, -1));
            return true;
        }

        return false; // Key doesn't exist
    }

    private cleanupEmptyObjects(obj: any, keyPath: string[]): void {
        if (keyPath.length === 0) return;

        let current = obj;
        for (let i = 0; i < keyPath.length - 1; i++) {
            current = current[keyPath[i]];
        }

        const targetKey = keyPath[keyPath.length - 1];
        const targetObj = current[targetKey];

        // If the object is empty (no keys), remove it
        if (typeof targetObj === 'object' && targetObj !== null && Object.keys(targetObj).length === 0) {
            delete current[targetKey];
            // Recursively clean up parent objects
            this.cleanupEmptyObjects(obj, keyPath.slice(0, -1));
        }
    }

    private findTranslationKeyAtPosition(lineText: string, cursorPosition: number): string | undefined {
        // Find all transloco expressions in the line
        const translocoMatches = [...lineText.matchAll(/([^}]*?)\s*\|\s*transloco/g)];

        for (const match of translocoMatches) {
            const expression = match[1];
            const expressionStart = match.index || 0;

            // Find all quoted strings in this expression (both single and double quotes)
            const quotedStrings = [
                ...expression.matchAll(/'([^']+)'/g),
                ...expression.matchAll(/"([^"]+)"/g)
            ];

            for (const quotedMatch of quotedStrings) {
                const quoteStart = expressionStart + (quotedMatch.index || 0);
                const keyStart = quoteStart + 1; // +1 to skip opening quote
                const keyEnd = keyStart + quotedMatch[1].length;

                // Check if cursor is within this specific translation key
                if (cursorPosition >= keyStart && cursorPosition <= keyEnd) {
                    const key = quotedMatch[1];
                    // Basic validation - should look like a translation key
                    if (key.includes('.') || key.match(/^[a-z][a-zA-Z0-9]*$/)) {
                        return key;
                    }
                }
            }
        }

        return undefined;
    }

    toggleTranslationPreview(statusBarItem?: vscode.StatusBarItem): void {
        this.previewMode = !this.previewMode;

        // Update status bar item appearance
        if (statusBarItem) {
            if (this.previewMode) {
                statusBarItem.text = '$(eye) Translation Preview';
                statusBarItem.tooltip = 'Translation Preview: ON - Showing actual values (Click to turn OFF)';
                statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
                statusBarItem.color = new vscode.ThemeColor('statusBarItem.prominentForeground');
            } else {
                statusBarItem.text = '$(eye-closed) Translation Preview';
                statusBarItem.tooltip = 'Translation Preview: OFF - Showing keys (Click to turn ON)';
                statusBarItem.backgroundColor = undefined;
                statusBarItem.color = undefined;
            }
        }

        if (this.previewMode) {
            vscode.window.showInformationMessage('Translation Preview: ON - Showing actual translation values');
            this.updateDecorations();
        } else {
            vscode.window.showInformationMessage('Translation Preview: OFF - Showing translation keys');
            this.clearDecorations();
        }
    }

    private updateDecorations(): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor || (editor.document.languageId !== 'html' && editor.document.languageId !== 'typescript')) {
            return;
        }

        const decorations: vscode.DecorationOptions[] = [];
        const text = editor.document.getText();
        const lines = text.split('\n');

        if (editor.document.languageId === 'html') {
            this.addHtmlDecorations(lines, decorations);
        } else if (editor.document.languageId === 'typescript') {
            this.addTypeScriptDecorations(lines, decorations);
        }

        editor.setDecorations(this.decorationType, decorations);
    }

    private addHtmlDecorations(lines: string[], decorations: vscode.DecorationOptions[]): void {
        lines.forEach((line, lineIndex) => {
            // Simplified approach - find all transloco expressions in the line
            const translocoMatches = [...line.matchAll(/([^}]*?)\s*\|\s*transloco/g)];

            for (const match of translocoMatches) {
                const expression = match[1];
                const expressionStart = match.index || 0;

                // Find all quoted strings in this expression
                const quotedStrings = [
                    ...expression.matchAll(/'([^']+)'/g),
                    ...expression.matchAll(/"([^"]+)"/g)
                ];

                for (const quotedMatch of quotedStrings) {
                    const key = quotedMatch[1];
                    const keyStart = expressionStart + (quotedMatch.index || 0);
                    const keyEnd = keyStart + quotedMatch[0].length;

                    // Get translation value
                    const translationValue = this.getTranslationValue(key);

                    if (translationValue && this.isValidTranslationKey(key)) {
                        const range = new vscode.Range(
                            lineIndex,
                            keyStart,
                            lineIndex,
                            keyEnd
                        );

                        decorations.push({
                            range,
                            renderOptions: {
                                after: {
                                    contentText: ` → "${translationValue}"`,
                                    color: '#888888',
                                    fontStyle: 'italic'
                                }
                            }
                        });
                    }
                }
            }
        });
    }

    private addTypeScriptDecorations(lines: string[], decorations: vscode.DecorationOptions[]): void {
        lines.forEach((line, lineIndex) => {
            const processedRanges = new Set<string>(); // Track processed ranges to avoid duplicates

            // Pattern 1: this.translocoService.translate('key') or this.translocoService.translate('key', { params })
            const translocoServiceMatches = [...line.matchAll(/(?:this\.)?translocoService\.translate\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*\{[^}]*\})?\s*\)/g)];

            // Pattern 2: transloco.translate('key') or transloco.translate('key', { params }) - But not translocoService
            const translocoMatches = [...line.matchAll(/(?<!Service\.)transloco\.translate\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*\{[^}]*\})?\s*\)/g)];

            // Process matches in order of specificity
            const allMatches = [
                ...translocoServiceMatches.map(m => ({ match: m, key: m[1], fullMatch: m[0], type: 'service' })),
                ...translocoMatches.map(m => ({ match: m, key: m[1], fullMatch: m[0], type: 'transloco' }))
            ];

            for (const { match, key, fullMatch } of allMatches) {
                const translationValue = this.getTranslationValue(key);

                if (translationValue && this.isValidTranslationKey(key)) {
                    const matchStart = match.index || 0;
                    const matchEnd = matchStart + fullMatch.length;
                    const rangeKey = `${lineIndex}-${matchStart}-${matchEnd}`;

                    // Skip if we've already processed this range
                    if (processedRanges.has(rangeKey)) {
                        continue;
                    }
                    processedRanges.add(rangeKey);

                    const range = new vscode.Range(
                        lineIndex,
                        matchStart,
                        lineIndex,
                        matchEnd
                    );

                    decorations.push({
                        range,
                        renderOptions: {
                            after: {
                                contentText: ` → "${translationValue}"`,
                                color: '#888888',
                                fontStyle: 'italic'
                            }
                        }
                    });
                }
            }
        });
    }

    private clearDecorations(): void {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.setDecorations(this.decorationType, []);
        }
    }

    getTranslationValue(key: string): string | undefined {
        if (!this.currentProject) {
            return undefined;
        }

        // Get translations dynamically based on project configuration
        if (this.currentProject.type === 'integrations-app') {
            return this.getIntegrationsAppTranslationValue(key);
        } else if (this.currentProject.type === 'fyle-app-v2') {
            return this.getFyleAppV2TranslationValue(key);
        }

        // Generic fallback
        return this.getGenericTranslationValue(key);
    }

    /**
     * Get translation value for integrations app (theme-based with fallback hierarchy)
     */
    private getIntegrationsAppTranslationValue(key: string): string | undefined {
        if (!this.currentProject) return undefined;

        // Try theme-specific overrides first, then fallback to common
        for (const translationPath of this.currentProject.translationPaths) {
            if (translationPath.isTheme) {
                const value = this.getTranslationWithFallback(key, translationPath.key);
                if (value) return value;
            }
        }

        // If no theme overrides, try common directly
        return this.getTranslationFromAnySource(key, 'common');
    }

    /**
     * Get translation value for fyle app v2 (module-based, first available)
     */
    private getFyleAppV2TranslationValue(key: string): string | undefined {
        // For module-based structure, return first available translation
        for (const translationPath of this.currentProject!.translationPaths) {
            const value = this.getNestedValue(this.translationCache.get(translationPath.key), key);
            if (value) {
                return value;
            }
        }
        return undefined;
    }

    /**
     * Generic translation value getter
     */
    private getGenericTranslationValue(key: string): string | undefined {
        if (!this.currentProject) return undefined;

        // Return first available translation from any file
        for (const translationPath of this.currentProject.translationPaths) {
            const value = this.getNestedValue(this.translationCache.get(translationPath.key), key);
            if (value) {
                return value;
            }
        }
        return undefined;
    }

    private isValidTranslationKey(key: string): boolean {
        // Validation based on actual codebase patterns
        if (!key || key.length < 2) return false;

        // Exclude obvious non-translation patterns
        if (key.includes('/')) return false; // File paths like 'assets/logos/...'
        if (key.includes('(') || key.includes(')')) return false; // Function calls
        if (key.includes('[') || key.includes(']')) return false; // CSS classes
        if (key.includes('{') || key.includes('}')) return false; // Template literals
        if (key.includes('$')) return false; // Variables
        if (key.includes('#')) return false; // IDs, colors
        if (key.includes('@')) return false; // Decorators, emails
        if (key.includes('*')) return false; // Wildcards
        if (key.includes('=')) return false; // Assignments
        if (key.includes('<') || key.includes('>')) return false; // HTML tags
        if (key.includes('|')) return false; // Pipes
        if (key.includes(' ')) return false; // Spaces
        if (key.includes('-') && key.includes('px')) return false; // CSS values

        // Exclude file extensions
        if (key.match(/\.(svg|png|jpg|jpeg|gif|ico|css|js|ts|html|json|xml)$/i)) return false;

        // Exclude CSS-like patterns (Tailwind classes)
        if (key.match(/^tw-/)) return false;
        if (key.match(/^(w-|h-|p-|m-|text-|bg-|border-|flex|grid|absolute|relative|fixed)/)) return false;

        // Exclude URLs
        if (key.includes('://')) return false;

        // Based on your codebase, valid translation keys follow these patterns:
        // 1. Dot notation: 'component.section.key' (most common)
        // 2. Simple words: 'common', 'services', 'pipes' (rare, usually top-level)

        // Must contain dots for proper namespacing (this is the main pattern in your codebase)
        if (!key.includes('.')) {
            // Allow only specific top-level keys that exist in your JSON
            const allowedTopLevel = ['common', 'services', 'pipes', 'directives'];
            return allowedTopLevel.includes(key);
        }

        // For dot notation, validate each part
        const parts = key.split('.');
        if (parts.length < 2) return false; // Must have at least component.key

        for (const part of parts) {
            if (!part) return false; // No empty parts
            if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(part)) return false; // Valid identifier
        }

        // Additional validation: first part should look like a component/module name
        const firstPart = parts[0];
        if (firstPart.length < 2) return false;

        return true;
    }

    // Translation Analysis Methods
    async initializeAnalysis(statusBarItem: vscode.StatusBarItem): Promise<void> {
        try {
            console.log('Initializing incremental translation analysis system...');

            // Perform initial full analysis to populate cache
            await this.analyzeTranslations(statusBarItem);

            // Mark incremental system as initialized
            this.incrementalAnalysisState.isInitialized = true;
            this.incrementalAnalysisState.lastFullAnalysisTime = new Date();
            this.incrementalAnalysisState.totalFilesAnalyzed = this.fileAnalysisCache.size;

            // console.log(`✅ Incremental analysis system initialized with ${this.fileAnalysisCache.size} files cached`);
            // console.log(`📊 PERFORMANCE BASELINE: Initial analysis completed - future translation file changes will be ~99% faster`);
        } catch (error) {
            console.error('Error initializing translation analysis:', error);
            statusBarItem.text = '$(error) Analysis Error';
            statusBarItem.tooltip = 'Error analyzing translations. Click to retry.';
        }
    }

    // Performance monitoring method
    private logPerformanceComparison(operation: string, actualDuration: number, estimatedOldDuration: number): void {
        const improvement = ((estimatedOldDuration - actualDuration) / estimatedOldDuration * 100).toFixed(1);
        const speedup = (estimatedOldDuration / actualDuration).toFixed(1);

        // console.log(`📈 PERFORMANCE COMPARISON for ${operation}:`);
        // console.log(`   ⚡ New (optimized): ${actualDuration}ms`);
        // console.log(`   🐌 Old (estimated): ${estimatedOldDuration}ms`);
        // console.log(`   🚀 Improvement: ${improvement}% faster (${speedup}x speedup)`);
    }

    async analyzeTranslationsWithValidation(statusBarItem?: vscode.StatusBarItem): Promise<void> {
        // Temporarily disable analysis for fyle-app-v2
        if (this.currentProject?.type === 'fyle-app-v2') {
            vscode.window.showInformationMessage('Translation analysis is temporarily disabled for Fyle App V2 projects');
            if (statusBarItem) {
                statusBarItem.text = '$(info) Analysis Disabled';
                statusBarItem.tooltip = 'Translation analysis is temporarily disabled for Fyle App V2 projects';
            }
            return;
        }

        if (!vscode.workspace.workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders[0];

        try {
            statusBarItem?.hide();

            // Show progress with cancellation support
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Analyzing translations with VS Code search validation...",
                cancellable: true
            }, async (progress, token) => {
                // Create abort controller for this analysis
                this.currentAnalysisAbortController = new AbortController();
                const signal = this.currentAnalysisAbortController.signal;

                // Listen for cancellation
                token.onCancellationRequested(() => {
                    this.currentAnalysisAbortController?.abort();
                });

                progress.report({ increment: 0, message: "Scanning source files..." });

                // Perform analysis
                await this.scanWorkspaceForTranslationKeys();

                if (signal.aborted) {
                    return;
                }

                progress.report({ increment: 50, message: "Calculating coverage with validation..." });

                // Analyze coverage with validation
                this.analysisCache = await this.calculateTranslationCoverageWithValidation();
                this.lastAnalysisTime = new Date();

                // Check if cancelled before updating UI
                if (signal.aborted) {
                    return;
                }

                progress.report({ increment: 100, message: "Analysis complete!" });

                // Update status bar
                if (statusBarItem) {
                    this.updateAnalysisStatusBar(statusBarItem);
                }
            });

        } catch (error) {
            console.error('Error during translation analysis with validation:', error);
            vscode.window.showErrorMessage(`Translation analysis failed: ${error}`);
        } finally {
            this.currentAnalysisAbortController = undefined;
        }
    }

    async analyzeTranslations(statusBarItem: vscode.StatusBarItem): Promise<void> {
        // Cancel any existing analysis
        if (this.currentAnalysisAbortController) {
            this.currentAnalysisAbortController.abort();
        }

        // Clear any pending analysis timeout
        if (this.analysisTimeoutId) {
            clearTimeout(this.analysisTimeoutId);
        }

        // Create new abort controller for this analysis
        this.currentAnalysisAbortController = new AbortController();
        const signal = this.currentAnalysisAbortController.signal;

        // Check if already cancelled before starting
        if (signal.aborted) {
            return;
        }

        if (this.currentProject?.type === 'fyle-app-v2') {
            vscode.window.showInformationMessage('Translation analysis is temporarily disabled for Fyle App V2 projects');
            if (statusBarItem) {
                statusBarItem.text = '$(info) Analysis Disabled';
                statusBarItem.tooltip = 'Translation analysis is temporarily disabled for Fyle App V2 projects';
            }
            return;
        }

        this.analysisInProgress = true;
        statusBarItem.text = '$(loading~spin) Analyzing...';
        statusBarItem.tooltip = 'Analyzing translation coverage...';

        try {
            // Scan workspace for translation keys
            await this.scanWorkspaceForTranslationKeys();

            // Check if cancelled during scanning
            if (signal.aborted) {
                return;
            }

            // Analyze coverage with automatic validation
            // console.log(`🔍 AUTO-VALIDATION: Running analysis with automatic VS Code search validation...`);
            this.analysisCache = await this.calculateTranslationCoverageWithValidation();
            this.lastAnalysisTime = new Date();

            // Check if cancelled before updating UI
            if (signal.aborted) {
                return;
            }

            // Update status bar
            this.updateAnalysisStatusBar(statusBarItem);

            // Only show success message for manual analysis, not auto-triggered ones
            if (!signal.aborted) {
                console.log('Translation analysis completed successfully');
            }
        } catch (error) {
            if (signal.aborted) {
                console.log('Translation analysis was cancelled');
                return;
            }

            console.error('Error analyzing translations:', error);
            statusBarItem.text = '$(error) Analysis Error';
            statusBarItem.tooltip = 'Error analyzing translations. Click to retry.';
            vscode.window.showErrorMessage(`Translation analysis failed: ${error}`);
        } finally {
            this.analysisInProgress = false;
            this.currentAnalysisAbortController = undefined;
        }
    }

    private updateAnalysisStatusBar(statusBarItem: vscode.StatusBarItem): void {


        if (!this.analysisCache) {
            statusBarItem.text = '$(question) No Analysis';
            statusBarItem.tooltip = 'Click to analyze translations';
            return;
        }

        // Calculate total missing based on project type
        let totalMissing: number;
        let tooltipDetails: string;

        if (this.currentProject?.type === 'fyle-app-v2') {
            // For app-v2, only count unused translations (missing analysis not applicable)
            totalMissing = this.analysisCache.unusedTranslations.length;
            tooltipDetails = totalMissing > 0
                ? `${totalMissing} unused translations found in modules. Click to view details.`
                : `All ${this.analysisCache.totalKeys} translation keys are used across ${this.currentProject.translationPaths.length} modules`;
        } else {
            // For integrations-app, count missing translations
            totalMissing = this.analysisCache.missingInCommon.length +
                          this.analysisCache.missingInFyle.length +
                          this.analysisCache.missingInCo.length;
            tooltipDetails = totalMissing > 0
                ? `${totalMissing} missing translations found. Click to view details.`
                : `All ${this.analysisCache.totalKeys} translation keys are covered`;
        }

        if (totalMissing === 0) {
        if (this.currentProject?.type === 'fyle-app-v2') {
        statusBarItem.text = '$(info) Analysis Disabled';
        statusBarItem.tooltip = 'Analysis Disabled';
        } else {
            statusBarItem.text = '$(check) All Translations OK';
            statusBarItem.tooltip = tooltipDetails; }
        } else {
            const label = this.currentProject?.type === 'fyle-app-v2' ? 'Unused' : 'Missing';
            statusBarItem.text = `$(warning) ${totalMissing} ${label}`;
            statusBarItem.tooltip = tooltipDetails;
        }
    }

    async scanWorkspaceForTranslationKeys(): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        this.allTranslationKeys.clear();
        this.keyUsageMap.clear();

        // Comprehensive exclude pattern that respects common ignore patterns
        const excludePattern = await this.buildExcludePattern(workspaceFolder);

        // Find all HTML and TypeScript files using project-specific source paths
        const htmlFiles: vscode.Uri[] = [];
        const tsFiles: vscode.Uri[] = [];

        if (this.currentProject) {
            for (const sourcePath of this.currentProject.sourcePaths) {
                const htmlPattern = sourcePath.replace('**/*.{html,ts}', '**/*.html');
                const tsPattern = sourcePath.replace('**/*.{html,ts}', '**/*.ts');

                const projectHtmlFiles = await vscode.workspace.findFiles(htmlPattern, excludePattern);
                const projectTsFiles = await vscode.workspace.findFiles(tsPattern, excludePattern);

                htmlFiles.push(...projectHtmlFiles);
                tsFiles.push(...projectTsFiles);
            }

            console.log(`🎯 SCOPE: Scanning ${this.currentProject.name} - found ${htmlFiles.length} HTML and ${tsFiles.length} TS files`);
        } else {
            console.warn('No project configuration found, using default src/app scope');
            const defaultHtmlFiles = await vscode.workspace.findFiles('src/app/**/*.html', excludePattern);
            const defaultTsFiles = await vscode.workspace.findFiles('src/app/**/*.ts', excludePattern);
            htmlFiles.push(...defaultHtmlFiles);
            tsFiles.push(...defaultTsFiles);
        }

        // Clear file cache for fresh start
        this.fileAnalysisCache.clear();

        // Scan HTML files and populate cache
        for (const file of htmlFiles) {
            const relativePath = vscode.workspace.asRelativePath(file);
            await this.scanFileForTranslationKeys(file, 'html');
            await this.updateFileAnalysisCache(file); // Also populate incremental cache
        }

        // Scan TypeScript files and populate cache
        for (const file of tsFiles) {
            const relativePath = vscode.workspace.asRelativePath(file);
            await this.scanFileForTranslationKeys(file, 'typescript');
            await this.updateFileAnalysisCache(file); // Also populate incremental cache
        }

        this.incrementalAnalysisState.totalFilesAnalyzed = this.fileAnalysisCache.size;
    }

    private async scanFileForTranslationKeys(fileUri: vscode.Uri, fileType: 'html' | 'typescript'): Promise<void> {
        try {
            const document = await vscode.workspace.openTextDocument(fileUri);
            const text = document.getText();
            const relativePath = vscode.workspace.asRelativePath(fileUri);

            const keysBefore = this.allTranslationKeys.size;

            if (fileType === 'html') {
                this.extractHtmlTranslationKeys(text, relativePath);
            } else {
                this.extractTypeScriptTranslationKeys(text, relativePath);
            }

            const keysAfter = this.allTranslationKeys.size;
            const keysFound = keysAfter - keysBefore;

            if (keysFound > 0) {
                // console.log(`🔍 SCAN DEBUG: Found ${keysFound} translation keys in ${relativePath}`);
            } else {
                // console.log(`🔍 SCAN DEBUG: No translation keys found in ${relativePath}`);
            }
        } catch (error) {
            console.error(`🔍 SCAN DEBUG: Error scanning file ${fileUri.fsPath}:`, error);
        }
    }

    private extractHtmlTranslationKeys(text: string, filePath: string): void {
        // Based on actual codebase patterns, extract only specific transloco usage patterns

        const interpolationMatches = [...text.matchAll(/\{\{\s*['"]([^'"]+)['"]\s*\|\s*transloco[^}]*\}\}/g)];

        // Fixed pattern that specifically handles double quotes containing single quotes
        const propertyBindingMatches = [...text.matchAll(/\[([^\]]+)\]\s*=\s*"'([^']+)'\s*\|\s*transloco/g)];

        // Also try pattern for single quotes containing double quotes: [attr]='"key" | transloco'
        const reverseQuoteMatches = [...text.matchAll(/\[([^\]]+)\]\s*=\s*'"([^"]+)"\s*\|\s*transloco/g)];
    
        // Pattern for transloco inside parentheses in property bindings: [attr]="expr + ('key' | transloco) + expr"
        const parenthesesMatches = [...text.matchAll(/\[([^\]]+)\]\s*=\s*"[^"]*\('([^']+)'\s*\|\s*transloco\)[^"]*"/g)];

        // Combine all property binding patterns
        const allPropertyBindingMatches = [...propertyBindingMatches, ...reverseQuoteMatches, ...parenthesesMatches];

        // Pattern 3: [transloco]="'key'" - Transloco directive
        const translocoDirectiveMatches = [...text.matchAll(/\[transloco\]\s*=\s*['"]([^'"]+)['"]/g)];

        // Pattern 4: 'key' | transloco: { params } - With parameters
        const parameterizedMatches = [...text.matchAll(/['"]([^'"]+)['"]\s*\|\s*transloco\s*:\s*\{[^}]*\}/g)];

        // Pattern 6: {{(condition ? 'key1' : 'key2') | transloco}} - Ternary operator in interpolation
        const ternaryMatches = [...text.matchAll(/\{\{\s*\([^?]+\?\s*['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]\s*\)\s*\|\s*transloco[^}]*\}\}/g)];
      
        // Pattern 6: {{condition ? ('key1' | transloco) : ('key2' | transloco)}} - Ternary with individual transloco pipes
        const ternaryIndividualMatches = [...text.matchAll(/\{\{\s*[^?]+\?\s*\(\s*['"]([^'"]+)['"]\s*\|\s*transloco\s*\)\s*:\s*\(\s*['"]([^'"]+)['"]\s*\|\s*transloco\s*\)\s*\}\}/g)];

        // Pattern 7: ('key' | transloco) - Generic parenthesized transloco (catches multiple on same line)
        const parenthesizedTranslocoMatches = [...text.matchAll(/\(\s*['"]([^'"]+)['"]\s*\|\s*transloco\s*\)/g)];


        // Process all matches - handle ternary matches specially since they have 2 keys each
        const ternaryKeyMatches = [];
        for (const match of ternaryMatches) {
            // Add both keys from ternary operator: match[1] is true case, match[2] is false case
            ternaryKeyMatches.push([match[0], match[1]]); // true case key
            ternaryKeyMatches.push([match[0], match[2]]); // false case key
        }

        // Process ternary individual matches (each branch has its own transloco pipe)
        const ternaryIndividualKeyMatches = [];
        for (const match of ternaryIndividualMatches) {
            // Add both keys from ternary individual operator: match[1] is true case, match[2] is false case
            ternaryIndividualKeyMatches.push([match[0], match[1]]); // true case key
            ternaryIndividualKeyMatches.push([match[0], match[2]]); // false case key
        }

        // Process nested transloco matches
        const nestedTranslocoKeys = this.extractNestedTranslocoKeys(text);
        const nestedTranslocoMatches = nestedTranslocoKeys.map(key => ['nested', key]); // Format as [fullMatch, key]

        const allMatches = [
            ...interpolationMatches,
            ...allPropertyBindingMatches.map(match => [match[0], match[2]]), // Use match[2] for the key from new pattern
            ...translocoDirectiveMatches,
            ...parameterizedMatches,
            ...ternaryKeyMatches, // Add both keys from ternary operators
            ...ternaryIndividualKeyMatches, // Add both keys from ternary individual operators
            ...parenthesizedTranslocoMatches, // Add keys from generic parenthesized transloco patterns
            ...nestedTranslocoMatches // Add keys from nested transloco patterns
        ];


        for (const match of allMatches) {
            const key = match[1];
       
            if (this.isValidTranslationKey(key)) {
       
                this.addKeyUsage(key, filePath);


            } 
        }
    }

    /**
     * Extract nested transloco keys from complex patterns like:
     * [placeholder]="'outerKey' | transloco: { param: 'innerKey' | transloco }"
     */
    private extractNestedTranslocoKeys(text: string): string[] {
        const nestedKeys: string[] = [];

        // Pattern for nested transloco: 'outerKey' | transloco: { ... 'innerKey' | transloco ... }
        // This regex finds transloco expressions that contain parameters with nested transloco
        const nestedPattern = /['"]([^'"]+)['"]\s*\|\s*transloco\s*:\s*\{[^}]*['"]([^'"]+)['"]\s*\|\s*transloco[^}]*\}/g;

        let match;
        while ((match = nestedPattern.exec(text)) !== null) {
            const outerKey = match[1];
            const innerKey = match[2];

            // Add both keys
            nestedKeys.push(outerKey);
            nestedKeys.push(innerKey);
        }

        // Also handle more complex nested patterns with multiple inner transloco calls
        // Pattern: 'outerKey' | transloco: { param1: 'innerKey1' | transloco, param2: 'innerKey2' | transloco }
        const multiNestedPattern = /['"]([^'"]+)['"]\s*\|\s*transloco\s*:\s*\{([^}]+)\}/g;

        while ((match = multiNestedPattern.exec(text)) !== null) {
            const outerKey = match[1];
            const paramBlock = match[2];

            // Find all inner transloco calls within the parameter block
            const innerTranslocoPattern = /['"]([^'"]+)['"]\s*\|\s*transloco/g;
            let innerMatch;

            while ((innerMatch = innerTranslocoPattern.exec(paramBlock)) !== null) {
                const innerKey = innerMatch[1];
                // console.log(`🔍 MULTI-NESTED TRANSLOCO: Found outer key "${outerKey}" with inner key "${innerKey}"`);

                // Add outer key only once per pattern
                if (!nestedKeys.includes(outerKey)) {
                    nestedKeys.push(outerKey);
                }
                nestedKeys.push(innerKey);
            }
        }

        return nestedKeys;
    }

    private extractTypeScriptTranslationKeys(text: string, filePath: string): void {
        // Based on actual codebase patterns, extract only specific transloco service usage

        // Pattern 1: this.translocoService.translate('key') or this.translocoService.translate('key', { params })
        const translocoServiceMatches = [...text.matchAll(/(?:this\.)?translocoService\.translate\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*\{[^}]*\})?\s*\)/g)];

        // Pattern 2: transloco.translate('key') or transloco.translate('key', { params })
        const translocoMatches = [...text.matchAll(/(?:\w+\.)?transloco\.translate\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*\{[^}]*\})?\s*\)/g)];

        // Pattern 3: .translate('key') or .translate('key', { params }) - Generic translate method calls
        const genericTranslateMatches = [...text.matchAll(/\.translate\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*\{[^}]*\})?\s*\)/g)];

        // Pattern 4: this.translocoService.translate(condition ? 'key1' : 'key2') - Ternary operator in TypeScript translate calls
        const tsTranslateTernaryMatches = [...text.matchAll(/(?:this\.)?translocoService\.translate\s*\(\s*[^?]+\?\s*['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]\s*(?:\s*,\s*\{[^}]*\})?\s*\)/g)];


        // Test the specific problematic line
        const testTsTranslateTernaryLine = `this.translocoService.translate(this.appName === AppName.TRAVELPERK ? 'configurationSelectField.preview' : 'configurationSelectField.exportModule')`;
        const testTsTranslateTernaryMatch = testTsTranslateTernaryLine.match(/(?:this\.)?translocoService\.translate\s*\(\s*[^?]+\?\s*['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]\s*(?:\s*,\s*\{[^}]*\})?\s*\)/);

        // Process ternary TypeScript matches specially since they have 2 keys each
        const tsTernaryKeyMatches = [];
        for (const match of tsTranslateTernaryMatches) {
            // Add both keys from ternary operator: match[1] is true case, match[2] is false case
            tsTernaryKeyMatches.push([match[0], match[1]]); // true case key
            tsTernaryKeyMatches.push([match[0], match[2]]); // false case key
        }

        // Process all matches
        const allMatches = [
            ...translocoServiceMatches,
            ...translocoMatches,
            ...genericTranslateMatches,
            ...tsTernaryKeyMatches // Add both keys from TypeScript ternary operators
        ];

        for (const match of allMatches) {
            const key = match[1];
            if (this.isValidTranslationKey(key)) {
                this.addKeyUsage(key, filePath);
            }
        }
    }

    private addKeyUsage(key: string, filePath: string): void {
        // Add to the set of all translation keys
        this.allTranslationKeys.add(key);

        // Track file usage
        if (!this.keyUsageMap.has(key)) {
            this.keyUsageMap.set(key, []);
        }
        const files = this.keyUsageMap.get(key)!;
        if (!files.includes(filePath)) {
            files.push(filePath);
        }
    }

    private async calculateTranslationCoverageWithValidation(): Promise<TranslationAnalysis> {
        // Temporarily disable analysis for fyle-app-v2
        if (this.currentProject?.type === 'fyle-app-v2') {
            console.log('⏸️ ANALYSIS: Skipping analysis for Fyle App V2 (temporarily disabled)');
            return this.getEmptyAnalysis();
        }

        const analysis = this.calculateTranslationCoverage();

        // Check if validation is enabled (can be disabled for performance)
        const config = vscode.workspace.getConfiguration('fyle-transloco');
        const validationEnabled = config.get('enableValidation', true);

        if (!validationEnabled) {
            // console.log(`⚠️ VALIDATION: Validation disabled in settings - skipping validation`);
            return analysis;
        }

        // Limit validation to reasonable number of keys for performance
        const maxKeysToValidate = 50;
        const keysToValidate = analysis.unusedTranslations.slice(0, maxKeysToValidate);

        if (analysis.unusedTranslations.length > maxKeysToValidate) {
            // console.log(`🔍 VALIDATION: Limiting validation to first ${maxKeysToValidate} keys for performance (${analysis.unusedTranslations.length} total)`);
        }

        // Validate unused translations using VS Code search as a second opinion
        console.log(`🔍 VALIDATION: Starting VS Code search validation for ${keysToValidate.length} potentially unused keys in ${this.currentProject?.name || 'unknown project'}...`);
        const validatedUnusedTranslations = await this.validateUnusedKeysWithVSCodeSearch(keysToValidate);
        const falsePositives = keysToValidate.length - validatedUnusedTranslations.length;

        // Add back the keys we didn't validate
        const remainingKeys = analysis.unusedTranslations.slice(maxKeysToValidate);
        const finalUnusedTranslations = [...validatedUnusedTranslations, ...remainingKeys];

        if (falsePositives > 0) {
            console.log(`🎯 VALIDATION: Found ${falsePositives} false positives that are actually used in ${this.currentProject?.name}!`);
            console.log(`📊 VALIDATION: Refined unused count from ${analysis.unusedTranslations.length} to ${finalUnusedTranslations.length}`);
        } else {
            console.log(`✅ VALIDATION: All ${keysToValidate.length} keys confirmed as unused in ${this.currentProject?.name}`);
        }

        // Return analysis with validated unused translations
        return {
            ...analysis,
            unusedTranslations: finalUnusedTranslations
        };
    }

    private calculateTranslationCoverage(): TranslationAnalysis {
        if (!this.currentProject) {
            console.warn('No project configuration found for analysis');
            return this.getEmptyAnalysis();
        }

        // Dynamic analysis based on project type
        if (this.currentProject.type === 'integrations-app') {
            return this.calculateIntegrationsAppCoverage();
        } else if (this.currentProject.type === 'fyle-app-v2') {
            return this.calculateFyleAppV2Coverage();
        }

        console.warn(`Unknown project type: ${this.currentProject.type}`);
        return this.getEmptyAnalysis();
    }

    private calculateIntegrationsAppCoverage(): TranslationAnalysis {
        const missingInCommon: string[] = [];
        const missingInFyle: string[] = [];
        const missingInCo: string[] = [];
        const unusedTranslations: string[] = [];

        if (!this.currentProject) {
            return this.getEmptyAnalysis();
        }

        // Get translations dynamically based on project configuration
        const translationsByKey = new Map<string, any>();
        const allAvailableKeys = new Set<string>();

        for (const translationPath of this.currentProject.translationPaths) {
            const translations = this.translationCache.get(translationPath.key) || {};
            translationsByKey.set(translationPath.key, translations);
            this.extractAllKeysFromObject(translations, '', allAvailableKeys);
        }

        // Check each used key for missing translations
        for (const key of this.allTranslationKeys) {
            const commonValue = this.getNestedValue(translationsByKey.get('common'), key);
            const fyleValue = this.getNestedValue(translationsByKey.get('fyle'), key);
            const coValue = this.getNestedValue(translationsByKey.get('co'), key);

            // Check if missing in common (and no theme override)
            if (!commonValue && !fyleValue && !coValue) {
                missingInCommon.push(key);
            }

            // Check if missing in fyle theme (no override and no common fallback)
            if (!fyleValue && !commonValue) {
                missingInFyle.push(key);
            }

            // Check if missing in co theme (no override and no common fallback)
            if (!coValue && !commonValue) {
                missingInCo.push(key);
            }
        }

        // Find unused translations (keys in JSON but not used in code)
        const problematicKey = 'configuration.exportSetting.corporateCard.exportSubLabel';

        for (const availableKey of allAvailableKeys) {
            if (!this.allTranslationKeys.has(availableKey)) {
                unusedTranslations.push(availableKey);
            }
        }

        // Calculate coverage percentages based on used keys
        const totalUsedKeys = this.allTranslationKeys.size;
        const totalAvailableKeys = allAvailableKeys.size;

        const commonCoverage = totalUsedKeys > 0 ? ((totalUsedKeys - missingInCommon.length) / totalUsedKeys) * 100 : 100;
        const fyleCoverage = totalUsedKeys > 0 ? ((totalUsedKeys - missingInFyle.length) / totalUsedKeys) * 100 : 100;
        const coCoverage = totalUsedKeys > 0 ? ((totalUsedKeys - missingInCo.length) / totalUsedKeys) * 100 : 100;

        return {
            totalKeys: totalUsedKeys,
            missingInCommon,
            missingInFyle,
            missingInCo,
            unusedTranslations,
            coveragePercentage: {
                common: Math.round(commonCoverage * 100) / 100,
                fyle: Math.round(fyleCoverage * 100) / 100,
                co: Math.round(coCoverage * 100) / 100
            }
        };
    }

    private calculateFyleAppV2Coverage(): TranslationAnalysis {
        const missingInCommon: string[] = [];
        const missingInFyle: string[] = [];
        const missingInCo: string[] = [];
        const unusedTranslations: string[] = [];

        // For Fyle App V2, we treat all modules as equal (no theme hierarchy)
        // Get all available translation keys from all module files
        const allAvailableKeys = new Set<string>();
        const moduleTranslations = new Map<string, any>();

        for (const translationPath of this.currentProject!.translationPaths) {
            const translations = this.translationCache.get(translationPath.key) || {};
            moduleTranslations.set(translationPath.key, translations);
            this.extractAllKeysFromObject(translations, '', allAvailableKeys);
        }

        // For Fyle App V2, we only check for unused translations
        // Missing translations are less relevant since modules are independent
        for (const availableKey of allAvailableKeys) {
            if (!this.allTranslationKeys.has(availableKey)) {
                unusedTranslations.push(availableKey);
            }
        }

        // Calculate basic coverage
        const totalUsedKeys = this.allTranslationKeys.size;

        return {
            totalKeys: totalUsedKeys,
            missingInCommon: [], // Not applicable for module-based structure
            missingInFyle: [],   // Not applicable for module-based structure
            missingInCo: [],     // Not applicable for module-based structure
            unusedTranslations,
            coveragePercentage: {
                common: 100, // Not applicable
                fyle: 100,   // Not applicable
                co: 100      // Not applicable
            }
        };
    }

    private getEmptyAnalysis(): TranslationAnalysis {
        return {
            totalKeys: 0,
            missingInCommon: [],
            missingInFyle: [],
            missingInCo: [],
            unusedTranslations: [],
            coveragePercentage: {
                common: 0,
                fyle: 0,
                co: 0
            }
        };
    }

    /**
     * Check if a nested key exists in a translation object
     */
    private hasNestedTranslationKey(obj: any, key: string): boolean {
        const keys = key.split('.');
        let current = obj;

        for (const k of keys) {
            if (!current || typeof current !== 'object' || !(k in current)) {
                return false;
            }
            current = current[k];
        }

        return true;
    }

    /**
     * Get the value of a nested key from a translation object
     */
    private getNestedTranslationValue(obj: any, key: string): any {
        const keys = key.split('.');
        let current = obj;

        for (const k of keys) {
            if (!current || typeof current !== 'object' || !(k in current)) {
                return undefined;
            }
            current = current[k];
        }

        return current;
    }

    private extractAllKeysFromObject(obj: any, prefix: string, keySet: Set<string>): void {
        if (!obj || typeof obj !== 'object') return;

        for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;

            if (typeof value === 'string') {
                // This is a translation value, add the key
                keySet.add(fullKey);
            } else if (typeof value === 'object' && value !== null) {
                // This is a nested object, recurse
                this.extractAllKeysFromObject(value, fullKey, keySet);
            }
        }
    }

    async showMissingTranslationsPopup(): Promise<void> {
        if (!this.analysisCache) {
            return;
        }

        const analysis = this.analysisCache;
        const totalMissing = analysis.missingInCommon.length + analysis.missingInFyle.length + analysis.missingInCo.length;

        if (totalMissing === 0 && analysis.unusedTranslations.length === 0) {
            const coverageMessage = this.getProjectSpecificCoverageMessage(analysis);
            vscode.window.showInformationMessage(
                `🎉 All translations are complete!\n\nTotal keys: ${analysis.totalKeys}\n${coverageMessage}`
            );
            return;
        }

        // Create quick pick items
        const items: vscode.QuickPickItem[] = [];

        if (analysis.missingInCommon.length > 0) {
            items.push({
                label: `$(error) Missing in Common`,
                description: `${analysis.missingInCommon.length} keys`,
                detail: 'Keys missing from en.json (affects both themes)'
            });
        }

        if (analysis.missingInFyle.length > 0) {
            items.push({
                label: `$(warning) Missing in Fyle Theme`,
                description: `${analysis.missingInFyle.length} keys`,
                detail: 'Keys missing from fyle/en.json and common fallback'
            });
        }

        if (analysis.missingInCo.length > 0) {
            items.push({
                label: `$(warning) Missing in Capital One Theme`,
                description: `${analysis.missingInCo.length} keys`,
                detail: 'Keys missing from co/en.json and common fallback'
            });
        }

        if (analysis.unusedTranslations.length > 0) {
        items.push({
        label: `$(info) Unused Translations`,
        description: `${analysis.unusedTranslations.length} keys`,
        detail: 'Keys in JSON files but not used in code'
    });
    }

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select category to view details',
            title: `Translation Analysis - ${totalMissing} Missing Translations`
        });

        if (selected) {
            if (selected.label.includes('Missing in Common')) {
                await this.showMissingKeysList(analysis.missingInCommon, 'Common (en.json)');
            } else if (selected.label.includes('Missing in Fyle')) {
                await this.showMissingKeysList(analysis.missingInFyle, 'Fyle Theme (fyle/en.json)');
            } else if (selected.label.includes('Missing in Capital One')) {
                await this.showMissingKeysList(analysis.missingInCo, 'Capital One Theme (co/en.json)');
            } else if (selected.label.includes('Unused Translations')) {
                await this.showUnusedKeysList(analysis.unusedTranslations);
            }
        }
    }

    private async showUnusedKeysList(unusedKeys: string[]): Promise<void> {
    if (unusedKeys.length === 0) {
        vscode.window.showInformationMessage('No unused translations found');
        return;
    }

    const items = unusedKeys.map(key => ({
        label: key,
        description: 'Unused translation',
        detail: 'This key exists in JSON but is not used in any code files'
    }));

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a key to delete or review',
        title: `Unused Translations (${unusedKeys.length} keys)`
    });

    if (selected) {
        // Option to delete the unused translation
        await this.quickDeleteTranslation(selected.label);
    }
}
    private async showMissingKeysList(missingKeys: string[], theme: string): Promise<void> {
        if (missingKeys.length === 0) {
            vscode.window.showInformationMessage(`No missing translations in ${theme}`);
            return;
        }

        const items = missingKeys.map(key => {
            const files = this.keyUsageMap.get(key) || [];
            return {
                label: key,
                description: `Used in ${files.length} file(s)`,
                detail: files.join(', ')
            };
        });

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: `Select a key to create translation in ${theme}`,
            title: `Missing in ${theme} (${missingKeys.length} keys)`
        });

        if (selected) {
            // Open edit dialog for the selected key
            await this.editTranslation(selected.label);
        }
    }

    private async buildExcludePattern(workspaceFolder: vscode.WorkspaceFolder): Promise<string> {
        // Default exclude patterns
        const defaultExcludes = [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/out/**',
            '**/.git/**',
            '**/.vscode/**',
            '**/.cursor/**',
            '**/coverage/**',
            '**/tmp/**',
            '**/temp/**',
            '**/*.min.js',
            '**/*.bundle.js',
            '**/*.d.ts'
        ];

        try {
            // Try to read .gitignore file
            const gitignorePath = path.join(workspaceFolder.uri.fsPath, '.gitignore');
            if (fs.existsSync(gitignorePath)) {
                const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
                const gitignorePatterns = gitignoreContent
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line && !line.startsWith('#')) // Remove empty lines and comments
                    .map(pattern => {
                        // Convert gitignore patterns to VS Code glob patterns
                        if (pattern.endsWith('/')) {
                            return `**/${pattern}**`;
                        } else if (pattern.includes('/')) {
                            return `**/${pattern}`;
                        } else {
                            return `**/${pattern}/**`;
                        }
                    });

                // Combine default excludes with gitignore patterns
                const allExcludes = [...defaultExcludes, ...gitignorePatterns];
                return `{${allExcludes.join(',')}}`;
            }
        } catch (error) {
            console.warn('Could not read .gitignore file:', error);
        }

        // Fallback to default excludes only
        return `{${defaultExcludes.join(',')}}`;
    }

    setupTranslationFileWatchers(statusBarItem: vscode.StatusBarItem): vscode.FileSystemWatcher {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            console.warn('No workspace folder found for setting up translation file watchers');
            // Return a dummy disposable if no workspace folder
            return { dispose: () => {} } as vscode.FileSystemWatcher;
        }

        // Create a comprehensive pattern that covers both project types
        let watchPattern: string;

        if (this.currentProject?.type === 'fyle-app-v2') {
            // Watch app-v2 specific paths
            watchPattern = '{app-v2/libs/shared/assets/i18n/**/*.json,app-v2/apps/*/src/assets/i18n/**/*.json}';
        } else {
            // Default to integrations-app pattern
            watchPattern = 'src/assets/i18n/**/*.json';
        }

        const translationFilePattern = new vscode.RelativePattern(
            workspaceFolder,
            watchPattern
        );

        console.log(`🔍 WATCHING: Translation files with pattern: ${watchPattern} (Project: ${this.currentProject?.type || 'unknown'})`);
        const watcher = vscode.workspace.createFileSystemWatcher(translationFilePattern);

        // Handle file changes (create, change, delete) - OPTIMIZED VERSION
        const handleTranslationFileChange = (uri: vscode.Uri) => {
            const relativePath = vscode.workspace.asRelativePath(uri);
            console.log(`🔄 TRANSLATION FILE CHANGED: ${relativePath} (Project: ${this.currentProject?.type || 'unknown'})`);

            // Show a brief notification
            vscode.window.showInformationMessage(
                `Translation file updated: ${relativePath.split('/').pop()}. Updating coverage...`,
                { modal: false }
            );

            // Refresh translations (load new JSON values)
            console.log(`🔄 REFRESHING: Translation cache for ${this.currentProject?.name || 'unknown project'}`);
            this.refreshTranslations();

            // Only recalculate coverage without re-scanning source files (with validation cache)
            this.recalculateTranslationCoverageOnly(statusBarItem);
        };

        // Register event handlers
        watcher.onDidCreate(handleTranslationFileChange);
        watcher.onDidChange(handleTranslationFileChange);
        watcher.onDidDelete((uri) => {
            const relativePath = vscode.workspace.asRelativePath(uri);
            // console.log(`Translation file deleted: ${relativePath}`);

            // Show warning for file deletion
            vscode.window.showWarningMessage(
                `Translation file deleted: ${relativePath.split('/').pop()}. Updating coverage...`
            );

            // Refresh translations and recalculate coverage only (with validation cache)
            this.refreshTranslations();
            this.recalculateTranslationCoverageOnly(statusBarItem);
        });

        console.log('Translation file watchers set up successfully');
        return watcher;
    }

    setupSourceFileWatchers(statusBarItem: vscode.StatusBarItem): vscode.FileSystemWatcher {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            console.warn('No workspace folder found for setting up source file watchers');
            return { dispose: () => {} } as vscode.FileSystemWatcher;
        }

        // Watch for changes to HTML and TypeScript files
        const sourceFilePattern = new vscode.RelativePattern(
            workspaceFolder,
            '**/*.{html,ts}'
        );

        const watcher = vscode.workspace.createFileSystemWatcher(sourceFilePattern);

        // Debounced handler for source file changes
        let sourceFileChangeTimeout: NodeJS.Timeout | undefined;
        const pendingChanges = new Set<string>();

        const handleSourceFileChange = (uri: vscode.Uri) => {
            const relativePath = vscode.workspace.asRelativePath(uri);

            // Skip certain files that shouldn't trigger analysis
            if (this.shouldSkipSourceFile(relativePath)) {
                return;
            }

            // console.log(`Source file changed: ${relativePath}`);
            pendingChanges.add(uri.toString());

            // Clear existing timeout
            if (sourceFileChangeTimeout) {
                clearTimeout(sourceFileChangeTimeout);
            }

            // Debounce multiple rapid changes
            sourceFileChangeTimeout = setTimeout(async () => {
                if (pendingChanges.size > 0) {
                    const changedUris = Array.from(pendingChanges).map(uriString => vscode.Uri.parse(uriString));
                    pendingChanges.clear();

                    try {
                        await this.incrementalAnalyzeFiles(changedUris, statusBarItem);
                    } catch (error) {
                        console.error('Error in incremental source file analysis:', error);
                        // Fallback to full analysis if incremental fails
                        this.debouncedAnalyzeTranslations(statusBarItem, 1000);
                    }
                }
            }, 500); // 500ms debounce for source files
        };

        // Register event handlers
        watcher.onDidCreate(handleSourceFileChange);
        watcher.onDidChange(handleSourceFileChange);
        watcher.onDidDelete(async (uri) => {
            const relativePath = vscode.workspace.asRelativePath(uri);
            // console.log(`Source file deleted: ${relativePath}`);

            // Remove from cache
            this.fileAnalysisCache.delete(relativePath);

            // Trigger incremental analysis to update global keys
            this.rebuildGlobalKeysFromCache();
            this.analysisCache = await this.calculateTranslationCoverageWithValidation();
            this.updateAnalysisStatusBar(statusBarItem);
        });

        console.log('Source file watchers set up successfully');
        this.sourceFileWatcher = watcher;
        return watcher;
    }

    // Incremental Analysis Methods
    private async updateFileAnalysisCache(fileUri: vscode.Uri): Promise<void> {
        try {
            const document = await vscode.workspace.openTextDocument(fileUri);
            const filePath = vscode.workspace.asRelativePath(fileUri);
            const stats = await vscode.workspace.fs.stat(fileUri);
            const lastModified = new Date(stats.mtime);

            // Check if file needs updating
            const existingCache = this.fileAnalysisCache.get(filePath);
            if (existingCache && existingCache.lastModified >= lastModified) {
                return; // File hasn't changed
            }

            // Extract translation keys from the file
            const translationKeys = new Set<string>();
            const keyUsageMap = new Map<string, number[]>();

            // Temporarily store the current state to restore after extraction
            const originalAllKeys = new Set(this.allTranslationKeys);
            const originalKeyUsageMap = new Map(this.keyUsageMap);

            // Clear current state to extract only from this file
            this.allTranslationKeys.clear();
            this.keyUsageMap.clear();

            if (document.languageId === 'html') {
                this.extractHtmlTranslationKeys(document.getText(), filePath);
            } else if (document.languageId === 'typescript') {
                this.extractTypeScriptTranslationKeys(document.getText(), filePath);
            }

            // Copy extracted keys to local variables
            for (const key of this.allTranslationKeys) {
                translationKeys.add(key);
            }
            // For the cache, we'll store line numbers as [1] since we don't track specific lines in the current extraction
            for (const key of this.allTranslationKeys) {
                keyUsageMap.set(key, [1]); // Simplified: just mark that the key exists in this file
            }

            // Restore original state
            this.allTranslationKeys = originalAllKeys;
            this.keyUsageMap = originalKeyUsageMap;

            // Update cache
            this.fileAnalysisCache.set(filePath, {
                filePath,
                lastModified,
                translationKeys,
                keyUsageMap,
                fileSize: stats.size
            });

            // Invalidate validation cache when source files change
            // This ensures validation results are recalculated when code changes
            if (this.validationCache.size > 0) {
                // console.log(`🗑️ VALIDATION CACHE: Clearing validation cache due to source file change: ${filePath}`);
                this.validationCache.clear();
                this.lastValidationTime = null;
            }

            // console.log(`🔧 INCREMENTAL FIX: Updated analysis cache for ${filePath}: ${translationKeys.size} keys found`);
        } catch (error) {
            console.error(`Error updating file analysis cache for ${fileUri.fsPath}:`, error);
        }
    }

    private extractHtmlTranslationKeysWithLines(text: string, translationKeys: Set<string>, keyUsageMap: Map<string, number[]>): void {
        const lines = text.split('\n');

        lines.forEach((line, lineIndex) => {
            // Pattern 1: {{ 'key' | transloco }} - Direct interpolation
            const interpolationMatches = [...line.matchAll(/\{\{\s*['"]([^'"]+)['"]\s*\|\s*transloco[^}]*\}\}/g)];

            // Pattern 2: [attribute]="'key' | transloco" - Property binding
            const propertyBindingMatches = [...line.matchAll(/\[[^\]]+\]\s*=\s*['"]([^'"]+)['"]\s*\|\s*transloco/g)];

            // Pattern 3: [transloco]="'key'" - Transloco directive
            const translocoDirectiveMatches = [...line.matchAll(/\[transloco\]\s*=\s*['"]([^'"]+)['"]/g)];

            // Pattern 4: 'key' | transloco: { params } - With parameters
            const parameterizedMatches = [...line.matchAll(/['"]([^'"]+)['"]\s*\|\s*transloco\s*:\s*\{[^}]*\}/g)];

            // Process all matches
            const allMatches = [
                ...interpolationMatches,
                ...propertyBindingMatches,
                ...translocoDirectiveMatches,
                ...parameterizedMatches
            ];

            for (const match of allMatches) {
                const key = match[1];
                if (this.isValidTranslationKey(key)) {
                    translationKeys.add(key);

                    if (!keyUsageMap.has(key)) {
                        keyUsageMap.set(key, []);
                    }
                    keyUsageMap.get(key)!.push(lineIndex + 1); // 1-based line numbers
                }
            }
        });
    }

    private extractTypeScriptTranslationKeysWithLines(text: string, translationKeys: Set<string>, keyUsageMap: Map<string, number[]>): void {
        const lines = text.split('\n');

        lines.forEach((line, lineIndex) => {
            // Pattern 1: this.translocoService.translate('key') or this.translocoService.translate('key', { params })
            const translocoServiceMatches = [...line.matchAll(/(?:this\.)?translocoService\.translate\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*\{[^}]*\})?\s*\)/g)];

            // Pattern 2: transloco.translate('key') or transloco.translate('key', { params })
            const translocoMatches = [...line.matchAll(/(?:\w+\.)?transloco\.translate\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*\{[^}]*\})?\s*\)/g)];

            // Pattern 3: .translate('key') or .translate('key', { params }) - Generic translate method calls
            const genericTranslateMatches = [...line.matchAll(/\.translate\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*\{[^}]*\})?\s*\)/g)];

            // Process all matches
            const allMatches = [
                ...translocoServiceMatches,
                ...translocoMatches,
                ...genericTranslateMatches
            ];

            for (const match of allMatches) {
                const key = match[1];
                if (this.isValidTranslationKey(key)) {
                    translationKeys.add(key);

                    if (!keyUsageMap.has(key)) {
                        keyUsageMap.set(key, []);
                    }
                    keyUsageMap.get(key)!.push(lineIndex + 1); // 1-based line numbers
                }
            }
        });
    }

    private async incrementalAnalyzeFiles(changedFiles: vscode.Uri[], statusBarItem: vscode.StatusBarItem): Promise<void> {
        // console.log(`🔄 OPTIMIZED: Incremental analysis for ${changedFiles.length} files (vs full workspace scan)`);
        const startTime = Date.now();

        try {
            // Update cache for changed files
            let keysUpdated = 0;
            for (const file of changedFiles) {
                const beforeSize = this.allTranslationKeys.size;
                await this.updateFileAnalysisCache(file);
                const afterSize = this.allTranslationKeys.size;
                keysUpdated += Math.abs(afterSize - beforeSize);
            }

            // Rebuild global translation keys from cache
            this.rebuildGlobalKeysFromCache();

            // Recalculate coverage with validation
            this.analysisCache = await this.calculateTranslationCoverageWithValidation();
            this.lastAnalysisTime = new Date();

            // Update status bar
            this.updateAnalysisStatusBar(statusBarItem);

            const duration = Date.now() - startTime;
            const fileNames = changedFiles.map(f => vscode.workspace.asRelativePath(f)).join(', ');
            // // console.log(`✅ PERFORMANCE: Incremental analysis completed in ${duration}ms for ${changedFiles.length} files (${keysUpdated} keys updated)`);
            // console.log(`📁 Files analyzed: ${fileNames}`);

            // Show performance notification for significant improvements
            if (duration < 200 && changedFiles.length > 0) {
                vscode.window.showInformationMessage(
                    `⚡ Analyzed ${changedFiles.length} files in ${duration}ms (incremental)`,
                    { modal: false }
                );
            }
        } catch (error) {
            console.error('Error in incremental analysis:', error);
            throw error;
        }
    }

    private rebuildGlobalKeysFromCache(): void {
        this.allTranslationKeys.clear();
        this.keyUsageMap.clear();

        for (const [filePath, cache] of this.fileAnalysisCache) {
            // Add all keys from this file to global set
            for (const key of cache.translationKeys) {
                this.allTranslationKeys.add(key);

                // Update global usage map
                if (!this.keyUsageMap.has(key)) {
                    this.keyUsageMap.set(key, []);
                }
                const files = this.keyUsageMap.get(key)!;
                if (!files.includes(filePath)) {
                    files.push(filePath);
                }
            }
        }

        // console.log(`Rebuilt global keys: ${this.allTranslationKeys.size} unique keys from ${this.fileAnalysisCache.size} files`);
    }

    private shouldSkipSourceFile(relativePath: string): boolean {
        // Skip files that shouldn't trigger translation analysis
        const skipPatterns = [
            /\.spec\.ts$/,           // Test files
            /\.test\.ts$/,           // Test files
            /\.d\.ts$/,              // Type definition files
            /node_modules/,          // Dependencies
            /dist/,                  // Build output
            /out/,                   // Build output
            /\.git/,                 // Git files
            /\.vscode/,              // VS Code settings
            /\.cursor/,              // Cursor settings
            /coverage/,              // Coverage reports
            /tmp/,                   // Temporary files
            /temp/,                  // Temporary files
        ];

        return skipPatterns.some(pattern => pattern.test(relativePath));
    }

    /**
     * Validates unused translation keys using VS Code's search functionality as a second opinion
     * This helps catch edge cases that our regex patterns might miss
     */
    private async validateUnusedKeysWithVSCodeSearch(potentiallyUnusedKeys: string[]): Promise<string[]> {
        const validatedUnusedKeys: string[] = [];
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

        if (!workspaceFolder || potentiallyUnusedKeys.length === 0) {
            return potentiallyUnusedKeys;
        }

        // Separate keys into cached and uncached
        const keysToValidate: string[] = [];
        const cachedResults = new Map<string, boolean>();

        for (const key of potentiallyUnusedKeys) {
            if (this.validationCache.has(key)) {
                cachedResults.set(key, this.validationCache.get(key)!);
                // console.log(`💾 VALIDATION: Using cached result for "${key}": ${this.validationCache.get(key) ? 'USED' : 'UNUSED'}`);
            } else {
                keysToValidate.push(key);
            }
        }

        // console.log(`🔍 VALIDATION: ${cachedResults.size} keys from cache, ${keysToValidate.length} keys to validate`);
        // console.log(`🔍 VALIDATION: Total validation cache size: ${this.validationCache.size}`);
        // console.log(`🔍 VALIDATION: Potentially unused keys:`, potentiallyUnusedKeys.slice(0, 10), '...');

        // Debug: Show some cached keys
        if (this.validationCache.size > 0) {
            const cachedKeys = Array.from(this.validationCache.keys()).slice(0, 5);
            // console.log(`🔍 VALIDATION: Sample cached keys:`, cachedKeys);
        }
        
        // Process only uncached keys in batches to avoid overwhelming the system
        const batchSize = 10;
        for (let i = 0; i < keysToValidate.length; i += batchSize) {
            const batch = keysToValidate.slice(i, i + batchSize);

            for (const key of batch) {
                try {
                    // console.log(`🔍 VALIDATION: Testing key "${key}" in workspace ${workspaceFolder.uri.fsPath}`);

                    // Use ripgrep for ultra-fast search (same as VS Code's internal search)
                    const keyFound = await this.searchWithRipgrep(key, workspaceFolder.uri.fsPath);

                    // Cache the validation result
                    this.validationCache.set(key, keyFound);
                    // console.log(`💾 VALIDATION: Cached result for "${key}": ${keyFound ? 'USED' : 'UNUSED'}`);

                    // console.log(`🔍 VALIDATION: Key "${key}" search result: ${keyFound ? 'FOUND' : 'NOT FOUND'}`);

                    if (!keyFound) {
                        // Ripgrep confirms it's unused
                        validatedUnusedKeys.push(key);
                        // console.log(`📝 VALIDATION: Added "${key}" to unused list`);
                    } else {
                        // console.log(`✅ VALIDATION: Removed "${key}" from unused list (found in codebase)`);
                    }
                } catch (error) {
                    console.warn(`⚠️ VALIDATION: Error searching for key "${key}":`, error);
                    // If search fails, keep it in the unused list to be safe and cache as unused
                    this.validationCache.set(key, false);
                    validatedUnusedKeys.push(key);
                }
            }

            // Small delay between batches to avoid overwhelming the system
            if (i + batchSize < keysToValidate.length) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }

        // Process cached results
        let cachedUsedCount = 0;
        let cachedUnusedCount = 0;

        for (const [key, isUsed] of cachedResults) {
            if (!isUsed) {
                // Key was cached as unused
                validatedUnusedKeys.push(key);
                cachedUnusedCount++;
                // console.log(`💾 VALIDATION: Using cached UNUSED result for "${key}"`);
            } else {
                // Key was cached as used (false positive)
                cachedUsedCount++;
                // console.log(`💾 VALIDATION: Using cached USED result for "${key}" (false positive)`);
            }
        }

        // console.log(`💾 VALIDATION: Processed ${cachedUsedCount} cached USED keys, ${cachedUnusedCount} cached UNUSED keys`);

        // Update validation timestamp
        this.lastValidationTime = new Date();

        // console.log(`✅ VALIDATION: Completed. ${potentiallyUnusedKeys.length - validatedUnusedKeys.length} false positives found`);
        // console.log(`💾 VALIDATION: Cache now contains ${this.validationCache.size} validation results`);

        // Debug: Show cache statistics
        const usedInCache = Array.from(this.validationCache.values()).filter(v => v).length;
        const unusedInCache = this.validationCache.size - usedInCache;
        // console.log(`💾 VALIDATION: Cache stats - ${usedInCache} USED keys, ${unusedInCache} UNUSED keys`);

        return validatedUnusedKeys;
    }

    /**
     * Search for a key using ripgrep (ultra-fast, same as VS Code's internal search)
     */
    private async searchWithRipgrep(searchKey: string, workspacePath: string): Promise<boolean> {
        return new Promise((resolve) => {
            const { spawn } = require('child_process');
            const path = require('path');

            // Try to find VS Code's bundled ripgrep first
            let rgPath = 'rg'; // Default fallback

            try {
                // Try multiple ripgrep locations
                const possiblePaths = [
                    // Extension's own ripgrep dependency
                    path.join(__dirname, '..', 'node_modules', '@vscode', 'ripgrep', 'bin', 'rg'),
                    path.join(__dirname, '..', 'node_modules', '@vscode', 'ripgrep', 'bin', 'rg.exe'),
                    // VS Code bundled ripgrep paths
                    path.join(vscode.env.appRoot, 'node_modules.asar.unpacked', '@vscode', 'ripgrep', 'bin', 'rg'),
                    path.join(vscode.env.appRoot, 'node_modules.asar.unpacked', '@vscode', 'ripgrep', 'bin', 'rg.exe'),
                    path.join(vscode.env.appRoot, 'node_modules.asar.unpacked', 'vscode-ripgrep', 'bin', 'rg'),
                    path.join(vscode.env.appRoot, 'node_modules.asar.unpacked', 'vscode-ripgrep', 'bin', 'rg.exe'),
                    path.join(vscode.env.appRoot, 'node_modules', '@vscode', 'ripgrep', 'bin', 'rg'),
                    path.join(vscode.env.appRoot, 'node_modules', '@vscode', 'ripgrep', 'bin', 'rg.exe'),
                    path.join(vscode.env.appRoot, 'node_modules', 'vscode-ripgrep', 'bin', 'rg'),
                    path.join(vscode.env.appRoot, 'node_modules', 'vscode-ripgrep', 'bin', 'rg.exe'),
                ];

                const fs = require('fs');
                for (const possiblePath of possiblePaths) {
                    if (fs.existsSync(possiblePath)) {
                        rgPath = possiblePath;
                        // console.log(`🔍 VALIDATION: Using VS Code bundled ripgrep at: ${rgPath}`);
                        break;
                    }
                }

                if (rgPath === 'rg') {
                    // console.log(`🔍 VALIDATION: Using system ripgrep (rg command)`);
                }
            } catch (error) {
                // console.log(`🔍 VALIDATION: Ripgrep path detection failed, using system rg`);
            }

            // Use ripgrep with correct flags (compatible with all versions) - project-aware search
            const searchPaths = this.getProjectSearchPaths(workspacePath);
            console.log(`🔍 VALIDATION: Searching for "${searchKey}" in paths:`, searchPaths);
            const rgArgs = [
                '--fixed-strings',  // Literal string search (faster than regex)
                '--quiet',          // Exit immediately on first match
                '--max-count=1',    // Stop after first match
                '--type=html',      // Only HTML files
                '--type=ts',        // Only TypeScript files
                '--glob=!node_modules/**',
                '--glob=!.git/**',
                '--glob=!dist/**',
                '--glob=!build/**',
                '--glob=!coverage/**',
                '--glob=!.angular/**',
                '--glob=!.vscode/**',
                searchKey,          // The search term
                ...searchPaths      // Project-specific search paths
            ];

            // console.log(`🔍 RIPGREP: Executing: ${rgPath} ${rgArgs.join(' ')}`);
            // console.log(`🔍 RIPGREP: Working directory: ${workspacePath}`);

            const rg = spawn(rgPath, rgArgs, {
                cwd: workspacePath,
                stdio: ['ignore', 'pipe', 'pipe']
            });

            let found = false;
            let resolved = false;
            let outputReceived = false;

            rg.stdout.on('data', (data: any) => {
                outputReceived = true;
                const output = data.toString().trim();
                // console.log(`🔍 RIPGREP: stdout received for "${searchKey}": ${output}`);

                // If we get any output, the key was found
                if (output) {
                    // console.log(`🎯 VALIDATION: Key "${searchKey}" found via ripgrep - removing from unused list`);
                    found = true;
                }
            });

            rg.stderr.on('data', (data: any) => {
                const error = data.toString().trim();
                // console.log(`🔍 RIPGREP: stderr received for "${searchKey}": ${error}`);
            });

            rg.on('close', (code: any) => {
                if (resolved) return;
                resolved = true;
                clearTimeout(timeout);

                // console.log(`🔍 RIPGREP: Process closed for "${searchKey}" with exit code: ${code}, found: ${found}, outputReceived: ${outputReceived}`);

                // ripgrep exit code 0 = found, 1 = not found, 2 = error
                if (code === 0 || found) {
                    // console.log(`🔍 RIPGREP: Resolving TRUE for "${searchKey}"`);
                    resolve(true);  // Key found
                } else {
                    // console.log(`🔍 RIPGREP: Resolving FALSE for "${searchKey}"`);
                    resolve(false); // Key not found
                }
            });

            rg.on('error', (error: any) => {
                if (resolved) return;
                resolved = true;
                clearTimeout(timeout);

                console.warn(`⚠️ VALIDATION: Ripgrep not available for key "${searchKey}":`, error.message);
                // Fallback to manual search if ripgrep is not available
                this.searchManually(searchKey, workspacePath).then(resolve).catch(() => resolve(false));
            });

            // Much shorter timeout - ripgrep should be very fast
            const timeout = setTimeout(() => {
                if (resolved) return;
                resolved = true;

                rg.kill();
                console.warn(`⚠️ VALIDATION: Ripgrep timeout for key "${searchKey}" - falling back to manual search`);
                // Fallback to manual search on timeout
                this.searchManually(searchKey, workspacePath).then(resolve).catch(() => resolve(false));
            }, 1000); // Reduced to 1 second
        });
    }

    /**
     * Fallback manual search when ripgrep is not available
     */
    private async searchManually(searchKey: string, workspacePath: string): Promise<boolean> {
        try {
            // console.log(`🔄 VALIDATION: Using manual search fallback for key "${searchKey}"`);

            const files = await vscode.workspace.findFiles(
                'src/app/**/*.{html,ts}',
                '{**/node_modules/**,**/.git/**,**/dist/**,**/build/**,**/coverage/**}'
            );

            // Search through first 50 files only for performance
            for (const file of files.slice(0, 50)) {
                try {
                    const document = await vscode.workspace.openTextDocument(file);
                    const content = document.getText();

                    if (content.includes(searchKey)) {
                        // console.log(`🎯 VALIDATION: Key "${searchKey}" found in ${vscode.workspace.asRelativePath(file)} (manual search) - removing from unused list`);
                        return true;
                    }
                } catch (fileError) {
                    // Skip files that can't be read
                    continue;
                }
            }

            return false; // Key not found
        } catch (error) {
            console.warn(`⚠️ VALIDATION: Manual search error for key "${searchKey}":`, error);
            return false;
        }
    }

    private async recalculateTranslationCoverageOnly(statusBarItem: vscode.StatusBarItem): Promise<void> {
        try {
            console.log('🚀 OPTIMIZED: Recalculating translation coverage (fast mode - no source file scan, with validation cache)');
            const startTime = Date.now();

            // Use validation analysis to preserve cached validation results
            // Translation file changes don't affect source code, so validation cache is still valid
            this.analysisCache = await this.calculateTranslationCoverageWithValidation();
            this.lastAnalysisTime = new Date();

            // Update status bar
            this.updateAnalysisStatusBar(statusBarItem);

            const duration = Date.now() - startTime;

            // Estimate what the old system would have taken (based on file count)
            const estimatedOldDuration = this.fileAnalysisCache.size * 2; // ~2ms per file for full scan
            this.logPerformanceComparison('Translation file change', duration, estimatedOldDuration);

            // Show performance improvement notification
            if (duration < 100) {
                const speedup = (estimatedOldDuration / duration).toFixed(1);
                vscode.window.showInformationMessage(
                    `Translation coverage updated in ${duration}ms`,
                    { modal: false }
                );
            }
        } catch (error) {
            console.error('Error recalculating translation coverage:', error);
            statusBarItem.text = '$(error) Coverage Error';
            statusBarItem.tooltip = 'Error recalculating coverage. Click to retry.';
        }
    }

    private debouncedAnalyzeTranslations(statusBarItem: vscode.StatusBarItem, delay: number = 1000): void {
        // Clear any existing timeout
        if (this.analysisTimeoutId) {
            clearTimeout(this.analysisTimeoutId);
        }

        // Cancel any ongoing analysis
        if (this.currentAnalysisAbortController) {
            this.currentAnalysisAbortController.abort();
        }

        // Set new timeout for debounced analysis
        this.analysisTimeoutId = setTimeout(() => {
            this.analyzeTranslations(statusBarItem);
        }, delay);
    }

    // Pattern Matching System for Translation Suggestions
    getTranslationSuggestions(key: string): TranslationSuggestion[] {
        const suggestions: TranslationSuggestion[] = [];

        // 1. Find exact pattern matches
        const exactMatches = this.findExactPatternMatches(key);
        suggestions.push(...exactMatches);

        // 2. Find similar key structure matches
        const structureMatches = this.findStructureMatches(key);
        suggestions.push(...structureMatches);

        // 3. Find semantic matches (same action words)
        const semanticMatches = this.findSemanticMatches(key);
        suggestions.push(...semanticMatches);

        // 4. Check user selection history
        const historyMatches = this.findHistoryMatches(key);
        suggestions.push(...historyMatches);

        // Sort by confidence and return top suggestions
        return suggestions
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 5);
    }

    private findExactPatternMatches(key: string): TranslationSuggestion[] {
        const suggestions: TranslationSuggestion[] = [];
        const keyParts = key.split('.');

        // Look for keys with same component and action
        if (keyParts.length >= 2) {
            const component = keyParts[0];
            const action = keyParts[keyParts.length - 1];

            for (const [existingKey, value] of this.getAllTranslationEntries()) {
                const existingParts = existingKey.split('.');

                if (existingParts.length >= 2 &&
                    existingParts[0] === component &&
                    existingParts[existingParts.length - 1] === action) {

                    suggestions.push({
                        value: value,
                        confidence: 0.9,
                        reason: `Same component "${component}" and action "${action}"`,
                        examples: [existingKey]
                    });
                }
            }
        }

        return suggestions;
    }

    private findStructureMatches(key: string): TranslationSuggestion[] {
        const suggestions: TranslationSuggestion[] = [];
        const keyParts = key.split('.');

        for (const [existingKey, value] of this.getAllTranslationEntries()) {
            const existingParts = existingKey.split('.');

            // Same structure (same number of parts)
            if (existingParts.length === keyParts.length) {
                let matchScore = 0;

                for (let i = 0; i < keyParts.length; i++) {
                    if (keyParts[i] === existingParts[i]) {
                        matchScore += 1;
                    } else if (this.isSimilarWord(keyParts[i], existingParts[i])) {
                        matchScore += 0.5;
                    }
                }

                const confidence = matchScore / keyParts.length;

                if (confidence > 0.3) {
                    suggestions.push({
                        value: this.adaptTranslationValue(value, keyParts, existingParts),
                        confidence: confidence * 0.7,
                        reason: `Similar structure to "${existingKey}"`,
                        examples: [existingKey]
                    });
                }
            }
        }

        return suggestions;
    }

    private findSemanticMatches(key: string): TranslationSuggestion[] {
        const suggestions: TranslationSuggestion[] = [];
        const actionWords = this.extractActionWords(key);

        if (actionWords.length === 0) return suggestions;

        for (const [existingKey, value] of this.getAllTranslationEntries()) {
            const existingActions = this.extractActionWords(existingKey);

            // Check for common action words
            const commonActions = actionWords.filter(action =>
                existingActions.some(existing => this.isSimilarWord(action, existing))
            );

            if (commonActions.length > 0) {
                const confidence = (commonActions.length / Math.max(actionWords.length, existingActions.length)) * 0.6;

                suggestions.push({
                    value: value,
                    confidence,
                    reason: `Similar actions: ${commonActions.join(', ')}`,
                    examples: [existingKey]
                });
            }
        }

        return suggestions;
    }

    private findHistoryMatches(key: string): TranslationSuggestion[] {
        const suggestions: TranslationSuggestion[] = [];
        const keyPattern = this.getKeyPattern(key);

        if (this.userSelectionHistory.has(keyPattern)) {
            const historicalValue = this.userSelectionHistory.get(keyPattern)!;
            suggestions.push({
                value: historicalValue,
                confidence: 0.8,
                reason: 'Based on your previous selections',
                examples: ['User history']
            });
        }

        return suggestions;
    }

    private getAllTranslationEntries(): [string, string][] {
        const entries: [string, string][] = [];

        if (!this.currentProject) {
            return entries;
        }

        // Get all translation entries dynamically based on project configuration
        for (const translationPath of this.currentProject.translationPaths) {
            const translations = this.translationCache.get(translationPath.key) || {};
            this.flattenTranslations(translations, '', entries);
        }

        return entries;
    }

    private flattenTranslations(obj: any, prefix: string, entries: [string, string][]): void {
        for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;

            if (typeof value === 'string') {
                entries.push([fullKey, value]);
            } else if (typeof value === 'object' && value !== null) {
                this.flattenTranslations(value, fullKey, entries);
            }
        }
    }

    private extractActionWords(key: string): string[] {
        const actionWords = ['save', 'cancel', 'delete', 'edit', 'create', 'update', 'add', 'remove',
                           'submit', 'confirm', 'close', 'open', 'view', 'show', 'hide', 'toggle',
                           'enable', 'disable', 'start', 'stop', 'pause', 'resume', 'reset'];

        return key.toLowerCase().split('.').filter(part =>
            actionWords.some(action => part.includes(action) || action.includes(part))
        );
    }

    private isSimilarWord(word1: string, word2: string): boolean {
        // Simple similarity check - can be enhanced with Levenshtein distance
        if (word1 === word2) return true;
        if (word1.includes(word2) || word2.includes(word1)) return true;

        // Check for common variations
        const variations = [
            ['btn', 'button'], ['msg', 'message'], ['txt', 'text'], ['img', 'image'],
            ['save', 'submit'], ['cancel', 'close'], ['delete', 'remove']
        ];

        return variations.some(([v1, v2]) =>
            (word1.includes(v1) && word2.includes(v2)) ||
            (word1.includes(v2) && word2.includes(v1))
        );
    }

    private adaptTranslationValue(value: string, newKeyParts: string[], existingKeyParts: string[]): string {
        // Simple adaptation - replace component names in the translation
        let adaptedValue = value;

        for (let i = 0; i < Math.min(newKeyParts.length, existingKeyParts.length); i++) {
            if (newKeyParts[i] !== existingKeyParts[i]) {
                // Replace component name in translation if it appears
                const oldComponent = this.humanizeKey(existingKeyParts[i]);
                const newComponent = this.humanizeKey(newKeyParts[i]);

                adaptedValue = adaptedValue.replace(new RegExp(oldComponent, 'gi'), newComponent);
            }
        }

        return adaptedValue;
    }

    private humanizeKey(key: string): string {
        // Convert camelCase/snake_case to human readable
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .toLowerCase()
            .trim();
    }

    private getKeyPattern(key: string): string {
        // Create a pattern for the key structure
        return key.split('.').map(part => {
            // Replace specific names with placeholders
            if (part.match(/^[A-Z][a-z]+/)) return '[Component]';
            if (part.match(/^\d+$/)) return '[Number]';
            return part;
        }).join('.');
    }

    recordUserSelection(key: string, selectedValue: string): void {
        const pattern = this.getKeyPattern(key);
        this.userSelectionHistory.set(pattern, selectedValue);

        // Persist to workspace state (optional)
        // vscode.workspace.getConfiguration().update('fyle-transloco.userHistory',
        //     Object.fromEntries(this.userSelectionHistory), vscode.ConfigurationTarget.Workspace);
    }

    async createTranslationWithSuggestions(key: string): Promise<void> {
        const suggestions = this.getTranslationSuggestions(key);

        if (suggestions.length === 0) {
            // No suggestions, open regular edit dialog
            await this.editTranslation(key);
            return;
        }

        // Show suggestions to user
        const items = suggestions.map(suggestion => ({
            label: suggestion.value,
            description: suggestion.reason,
            detail: `Confidence: ${Math.round(suggestion.confidence * 100)}%`
        }));

        items.push({
            label: '$(edit) Enter custom translation...',
            description: 'Create your own translation',
            detail: 'Manual entry'
        });

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: `Select or create translation for "${key}"`,
            title: 'Translation Suggestions'
        });

        if (selected) {
            if (selected.label.startsWith('$(edit)')) {
                // User wants to enter custom translation
                await this.editTranslation(key);
            } else {
                // User selected a suggestion
                await this.createTranslationInFile(key, selected.label);
                this.recordUserSelection(key, selected.label);

                vscode.window.showInformationMessage(
                    `Translation created: "${key}" = "${selected.label}"`
                );
            }
        }
    }

    private async createTranslationInFile(key: string, value: string): Promise<void> {
        if (!this.currentProject || this.currentProject.translationPaths.length === 0) {
            vscode.window.showErrorMessage('No translation files available for creating translations');
            return;
        }

        // For integrations-app, default to common file
        // For fyle-app-v2, default to first available file (usually shared)
        const defaultTranslationPath = this.currentProject.type === 'integrations-app'
            ? this.currentProject.translationPaths.find(p => p.key === 'common') || this.currentProject.translationPaths[0]
            : this.currentProject.translationPaths[0];

        const targetFilePath = defaultTranslationPath.filePath;

        try {
            const fileContent = fs.readFileSync(targetFilePath, 'utf8');
            const translations = JSON.parse(fileContent);

            // Set nested value
            this.setNestedValue(translations, key, value);

            // Write back to file
            const updatedContent = JSON.stringify(translations, null, 2);
            fs.writeFileSync(targetFilePath, updatedContent, 'utf8');

            // Refresh translations cache
            this.refreshTranslations();

        } catch (error) {
            vscode.window.showErrorMessage(`Failed to create translation: ${error}`);
        }
    }



}

// Translation Suggestion Provider for JSON files
class TranslationSuggestionProvider implements vscode.CompletionItemProvider {
    constructor(private translocoProvider: TranslocoHoverProvider) {}

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[]> {

        // Only provide suggestions in translation JSON files
        if (!document.fileName.includes('i18n') || !document.fileName.endsWith('.json')) {
            return [];
        }

        const line = document.lineAt(position.line);
        const lineText = line.text;

        // Check if we're in a value position (after a colon)
        const colonIndex = lineText.indexOf(':');
        if (colonIndex === -1 || position.character <= colonIndex) {
            return []; // We're in key position, not value position
        }

        // Extract the key from the current line
        const keyMatch = lineText.match(/^\s*"([^"]+)"\s*:/);
        if (!keyMatch) return [];

        const currentKey = this.buildFullKey(document, position.line, keyMatch[1]);
        const suggestions = this.translocoProvider.getTranslationSuggestions(currentKey);

        return suggestions.map((suggestion, index) => {
            const item = new vscode.CompletionItem(
                `"${suggestion.value}"`,
                vscode.CompletionItemKind.Text
            );

            item.detail = `💡 ${suggestion.reason}`;
            item.documentation = new vscode.MarkdownString(
                `**Confidence:** ${Math.round(suggestion.confidence * 100)}%\n\n` +
                `**Examples:**\n${suggestion.examples.map(ex => `- ${ex}`).join('\n')}`
            );

            // Higher confidence suggestions appear first
            item.sortText = String(1000 - Math.round(suggestion.confidence * 1000)).padStart(4, '0');

            // Add snippet for easy insertion
            item.insertText = `"${suggestion.value}"`;
            item.range = this.getValueRange(document, position);

            return item;
        });
    }

    private buildFullKey(document: vscode.TextDocument, lineNumber: number, currentKey: string): string {
        const keyPath: string[] = [currentKey];
        let indentLevel = this.getIndentLevel(document.lineAt(lineNumber).text);

        // Walk up the document to build the full key path
        for (let i = lineNumber - 1; i >= 0; i--) {
            const line = document.lineAt(i);
            const lineIndent = this.getIndentLevel(line.text);

            if (lineIndent < indentLevel) {
                const keyMatch = line.text.match(/^\s*"([^"]+)"\s*:\s*\{/);
                if (keyMatch) {
                    keyPath.unshift(keyMatch[1]);
                    indentLevel = lineIndent;
                }
            }
        }

        return keyPath.join('.');
    }

    private getIndentLevel(text: string): number {
        const match = text.match(/^(\s*)/);
        return match ? match[1].length : 0;
    }

    private getValueRange(document: vscode.TextDocument, position: vscode.Position): vscode.Range {
        const line = document.lineAt(position.line);
        const lineText = line.text;

        // Find the value part after the colon
        const colonIndex = lineText.indexOf(':');
        const valueStart = lineText.indexOf('"', colonIndex);
        const valueEnd = lineText.lastIndexOf('"');

        if (valueStart !== -1 && valueEnd !== -1 && valueEnd > valueStart) {
            return new vscode.Range(
                position.line, valueStart,
                position.line, valueEnd + 1
            );
        }

        return new vscode.Range(position, position);
    }
}

// Quick Action Provider for creating missing translations
class TranslationQuickActionProvider implements vscode.CodeActionProvider {
    constructor(private translocoProvider: TranslocoHoverProvider) {}

    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CodeAction[]> {

        const actions: vscode.CodeAction[] = [];

        // Check if we're in a translation key context
        const line = document.lineAt(range.start.line);
        const translationKey = this.extractTranslationKey(line.text, range.start.character);

        if (translationKey && !this.translocoProvider.getTranslationValue(translationKey)) {
            // Create action to add missing translation
            const createAction = new vscode.CodeAction(
                `Create translation for "${translationKey}"`,
                vscode.CodeActionKind.QuickFix
            );

            createAction.command = {
                command: 'fyle-transloco.createTranslation',
                title: 'Create Translation',
                arguments: [translationKey]
            };

            actions.push(createAction);
        }

        return actions;
    }

    private extractTranslationKey(lineText: string, position: number): string | undefined {
        // Extract translation key from HTML or TypeScript context
        const htmlMatch = lineText.match(/['"]([^'"]+)['"]\s*\|\s*transloco/);
        if (htmlMatch) return htmlMatch[1];

        const tsMatch = lineText.match(/\.translate\s*\(\s*['"]([^'"]+)['"]/);
        if (tsMatch) return tsMatch[1];

        return undefined;
    }
}


export function deactivate() {}


