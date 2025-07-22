import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface EditOption {
    label: string;
    description: string;
    filePath: string;
    currentValue: string | undefined;
    theme: 'common' | 'fyle' | 'co';
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

interface MissingTranslationItem {
    key: string;
    themes: ('common' | 'fyle' | 'co')[];
    files: string[];
}

interface TranslationPattern {
    keyPattern: string;
    valuePattern: string;
    confidence: number;
    examples: { key: string; value: string }[];
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
        this.translationCache.clear();
        this.loadAllTranslations();
        // Clear analysis cache to trigger re-analysis
        this.analysisCache = undefined;
    }

    showTranslationStatus(): void {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        const i18nDir = path.join(workspaceFolder.uri.fsPath, 'src/assets/i18n');
        const files = [
            { name: 'Common (en.json)', path: path.join(i18nDir, 'en.json') },
            { name: 'Fyle (fyle/en.json)', path: path.join(i18nDir, 'fyle/en.json') },
            { name: 'Capital One (co/en.json)', path: path.join(i18nDir, 'co/en.json') }
        ];

        const status = files.map(file => {
            const exists = fs.existsSync(file.path);
            const size = exists ? this.translationCache.get(file.name.split(' ')[0].toLowerCase()) ? 'Loaded' : 'Error' : 'Not Found';
            return `${file.name}: ${exists ? '✅' : '❌'} ${size}`;
        }).join('\n');

        vscode.window.showInformationMessage(`Translation Files Status:\n\n${status}\n\nLast loaded: ${this.lastLoadTime.toLocaleTimeString()}`);
    }

    async editTranslation(key: string): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        try {
            // Get current translations for the key
            const fyleTranslation = this.getTranslationForTheme(key, 'fyle');
            const coTranslation = this.getTranslationForTheme(key, 'co');
            const commonTranslation = this.getNestedValue(this.translationCache.get('common'), key);

            // Determine edit options
            const editOptions = this.getEditOptions(key, fyleTranslation, coTranslation, commonTranslation);

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
            // Get current translations for the key
            const fyleTranslation = this.getTranslationForTheme(key, 'fyle');
            const coTranslation = this.getTranslationForTheme(key, 'co');
            const commonTranslation = this.getNestedValue(this.translationCache.get('common'), key);

            // Determine which files have this key
            const editOptions = this.getEditOptions(key, fyleTranslation, coTranslation, commonTranslation);
            const availableOptions = editOptions.filter(option => option.currentValue); // Only show options that have values

            if (availableOptions.length === 0) {
                vscode.window.showWarningMessage(`Translation key "${key}" not found in any theme files`);
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
                    const truncatedValue = currentValue.length > 50 ? currentValue.substring(0, 47) + '...' : currentValue;

                    return {
                        label: `${themeIcon} Delete from ${option.label}`,
                        description: `Remove key from ${option.description.toLowerCase()}`,
                        detail: `Current: "${truncatedValue}"`,
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

            const picked = await vscode.window.showQuickPick(themeItems, {
                placeHolder: `🎯 Select which theme file to edit for key: ${key}`,
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

            // Show success with theme icon
            vscode.window.showInformationMessage(
                `${themeIcon} Translation updated successfully in ${selectedOption.label}`,
                { modal: false }
            );
        } catch (error) {
            vscode.window.showErrorMessage(`Error updating translation: ${error}`);
        }
    }



    private getThemeIcon(theme: 'common' | 'fyle' | 'co'): string {
        switch (theme) {
            case 'common':
                return '📄';
            case 'fyle':
                return '🟣';
            case 'co':
                return '🔵';
            default:
                return '📝';
        }
    }

    private loadAllTranslations(): void {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) return;

        const i18nDir = path.join(workspaceFolder.uri.fsPath, 'src/assets/i18n');
        
        // Load main common file
        this.loadTranslationFile(path.join(i18nDir, 'en.json'), 'common');
        
        // Load theme-specific override files
        this.loadTranslationFile(path.join(i18nDir, 'fyle/en.json'), 'fyle');
        this.loadTranslationFile(path.join(i18nDir, 'co/en.json'), 'co');
        
        this.lastLoadTime = new Date();
    }

    private loadTranslationFile(filePath: string, theme: string): void {
        try {
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const translations = JSON.parse(content);
                this.translationCache.set(theme, translations);
                console.log(`Loaded ${theme} translations from ${filePath}`);
            }
        } catch (error) {
            console.error(`Error loading ${theme} translations:`, error);
        }
    }

    private getTranslationForTheme(key: string, theme: 'fyle' | 'co'): string | undefined {
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

    private createHoverContent(key: string): vscode.Hover {
        const config = vscode.workspace.getConfiguration('fyle-transloco');
        const showSourceInfo = config.get('showSourceInfo', true);
        const highlightOverrides = config.get('highlightOverrides', true);
        
        const markdownContent = new vscode.MarkdownString();
        markdownContent.isTrusted = true;
        
        markdownContent.appendMarkdown(`**🔤 Translation Key:** \`${key}\` [✏️ Edit](command:fyle-transloco.editTranslation?${encodeURIComponent(JSON.stringify([key]))}) [🗑️ Delete](command:fyle-transloco.deleteTranslation?${encodeURIComponent(JSON.stringify([key]))})\n\n`);
        
        // Get translations for both themes
        const fyleTranslation = this.getTranslationForTheme(key, 'fyle');
        const coTranslation = this.getTranslationForTheme(key, 'co');
        const commonTranslation = this.getNestedValue(this.translationCache.get('common'), key);
        
        // Check if translation exists at all
        if (!fyleTranslation && !coTranslation && !commonTranslation) {
            markdownContent.appendMarkdown(`❌ **Translation not found**\n\n`);
            markdownContent.appendMarkdown(`*Make sure the key exists in your translation files*`);
            return new vscode.Hover(markdownContent);
        }
        
        // Show if it's a common translation (same for both themes)
        if (fyleTranslation === coTranslation && commonTranslation && fyleTranslation === commonTranslation) {
            markdownContent.appendMarkdown(`📄 **Common (Both Themes):** ${commonTranslation}\n\n`);
        } else {
            // Show theme-specific differences
            if (fyleTranslation) {
                const isOverride = fyleTranslation !== commonTranslation;
                const icon = isOverride && highlightOverrides ? '🔄' : '🟣';
                markdownContent.appendMarkdown(`${icon} **Fyle${isOverride ? ' (Override)' : ''}:** ${fyleTranslation}\n\n`);
            }

            if (coTranslation) {
                const isOverride = coTranslation !== commonTranslation;
                const icon = isOverride && highlightOverrides ? '🔄' : '🔵';
                markdownContent.appendMarkdown(`${icon} **Capital One${isOverride ? ' (Override)' : ''}:** ${coTranslation}\n\n`);
            }

            // Show common fallback if different from theme versions
            if (commonTranslation && (commonTranslation !== fyleTranslation || commonTranslation !== coTranslation)) {
                markdownContent.appendMarkdown(`📋 **Common Fallback:** ${commonTranslation}\n\n`);
            }
        }
        
        // Show source information
        if (showSourceInfo) {
            const sourceInfo = this.getTranslationSource(key);
            markdownContent.appendMarkdown(`---\n*📁 Source: ${sourceInfo}*`);
        }

        return new vscode.Hover(markdownContent);
    }

    private getTranslationSource(key: string): string {
        const fyleOverride = this.getNestedValue(this.translationCache.get('fyle'), key);
        const coOverride = this.getNestedValue(this.translationCache.get('co'), key);
        const common = this.getNestedValue(this.translationCache.get('common'), key);
        
        if (fyleOverride && coOverride) {
            return 'Both theme files override common';
        } else if (fyleOverride) {
            return 'fyle/en.json overrides common';
        } else if (coOverride) {
            return 'co/en.json overrides common';
        } else if (common) {
            return 'en.json (common)';
        }
        
        return 'Translation not found';
    }

    private getNestedValue(obj: any, key: string): string | undefined {
        if (!obj) return undefined;
        return key.split('.').reduce((o, k) => o?.[k], obj);
    }

    private getEditOptions(key: string, fyleTranslation: string | undefined, coTranslation: string | undefined, commonTranslation: string | undefined): EditOption[] {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) return [];

        const i18nDir = path.join(workspaceFolder.uri.fsPath, 'src/assets/i18n');
        const options: EditOption[] = [];

        // Common file option
        const commonPath = path.join(i18nDir, 'en.json');
        if (fs.existsSync(commonPath)) {
            options.push({
                label: 'Common (en.json)',
                description: 'Edit the common translation (affects both themes)',
                filePath: commonPath,
                currentValue: commonTranslation,
                theme: 'common'
            });
        }

        // Fyle theme option
        const fylePath = path.join(i18nDir, 'fyle/en.json');
        if (fs.existsSync(fylePath)) {
            options.push({
                label: 'Fyle Theme (fyle/en.json)',
                description: 'Edit Fyle-specific override',
                filePath: fylePath,
                currentValue: this.getNestedValue(this.translationCache.get('fyle'), key),
                theme: 'fyle'
            });
        }

        // Capital One theme option
        const coPath = path.join(i18nDir, 'co/en.json');
        if (fs.existsSync(coPath)) {
            options.push({
                label: 'Capital One Theme (co/en.json)',
                description: 'Edit Capital One-specific override',
                filePath: coPath,
                currentValue: this.getNestedValue(this.translationCache.get('co'), key),
                theme: 'co'
            });
        }

        return options;
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
        // Try to get translation for current theme (you might want to make this configurable)
        const fyleValue = this.getTranslationForTheme(key, 'fyle');
        if (fyleValue) return fyleValue;

        const coValue = this.getTranslationForTheme(key, 'co');
        if (coValue) return coValue;

        // Fallback to common
        return this.getNestedValue(this.translationCache.get('common'), key);
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

            console.log(`✅ Incremental analysis system initialized with ${this.fileAnalysisCache.size} files cached`);
            console.log(`📊 PERFORMANCE BASELINE: Initial analysis completed - future translation file changes will be ~99% faster`);
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

        console.log(`📈 PERFORMANCE COMPARISON for ${operation}:`);
        console.log(`   ⚡ New (optimized): ${actualDuration}ms`);
        console.log(`   🐌 Old (estimated): ${estimatedOldDuration}ms`);
        console.log(`   🚀 Improvement: ${improvement}% faster (${speedup}x speedup)`);
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

            // Analyze coverage
            this.analysisCache = this.calculateTranslationCoverage();
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

        const totalMissing = this.analysisCache.missingInCommon.length +
                           this.analysisCache.missingInFyle.length +
                           this.analysisCache.missingInCo.length;

        if (totalMissing === 0) {
            statusBarItem.text = '$(check) All Translations OK';
            statusBarItem.tooltip = `All ${this.analysisCache.totalKeys} translation keys are covered`;
        } else {
            statusBarItem.text = `$(warning) ${totalMissing} Missing`;
            statusBarItem.tooltip = `${totalMissing} missing translations found. Click to view details.`;
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

        // Find all HTML and TypeScript files while respecting gitignore and common excludes
        const htmlFiles = await vscode.workspace.findFiles('**/*.html', excludePattern);
        const tsFiles = await vscode.workspace.findFiles('**/*.ts', excludePattern);

        // Clear file cache for fresh start
        this.fileAnalysisCache.clear();

        // Scan HTML files and populate cache
        for (const file of htmlFiles) {
            await this.scanFileForTranslationKeys(file, 'html');
            await this.updateFileAnalysisCache(file); // Also populate incremental cache
        }

        // Scan TypeScript files and populate cache
        for (const file of tsFiles) {
            await this.scanFileForTranslationKeys(file, 'typescript');
            await this.updateFileAnalysisCache(file); // Also populate incremental cache
        }

        console.log(`Initial analysis completed: ${this.fileAnalysisCache.size} files cached, ${this.allTranslationKeys.size} unique keys found`);
        this.incrementalAnalysisState.totalFilesAnalyzed = this.fileAnalysisCache.size;
    }

    private async scanFileForTranslationKeys(fileUri: vscode.Uri, fileType: 'html' | 'typescript'): Promise<void> {
        try {
            const document = await vscode.workspace.openTextDocument(fileUri);
            const text = document.getText();
            const relativePath = vscode.workspace.asRelativePath(fileUri);

            if (fileType === 'html') {
                this.extractHtmlTranslationKeys(text, relativePath);
            } else {
                this.extractTypeScriptTranslationKeys(text, relativePath);
            }
        } catch (error) {
            console.error(`Error scanning file ${fileUri.fsPath}:`, error);
        }
    }

    private extractHtmlTranslationKeys(text: string, filePath: string): void {
        // Based on actual codebase patterns, extract only specific transloco usage patterns

        // Pattern 1: {{ 'key' | transloco }} - Direct interpolation
        const interpolationMatches = [...text.matchAll(/\{\{\s*['"]([^'"]+)['"]\s*\|\s*transloco[^}]*\}\}/g)];

        // Pattern 2: [attribute]="'key' | transloco" - Property binding
        const propertyBindingMatches = [...text.matchAll(/\[[^\]]+\]\s*=\s*['"]([^'"]+)['"]\s*\|\s*transloco/g)];

        // Pattern 3: [transloco]="'key'" - Transloco directive
        const translocoDirectiveMatches = [...text.matchAll(/\[transloco\]\s*=\s*['"]([^'"]+)['"]/g)];

        // Pattern 4: 'key' | transloco: { params } - With parameters
        const parameterizedMatches = [...text.matchAll(/['"]([^'"]+)['"]\s*\|\s*transloco\s*:\s*\{[^}]*\}/g)];

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
                this.addKeyUsage(key, filePath);
            }
        }
    }

    private extractTypeScriptTranslationKeys(text: string, filePath: string): void {
        // Based on actual codebase patterns, extract only specific transloco service usage

        // Pattern 1: this.translocoService.translate('key') or this.translocoService.translate('key', { params })
        const translocoServiceMatches = [...text.matchAll(/(?:this\.)?translocoService\.translate\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*\{[^}]*\})?\s*\)/g)];

        // Pattern 2: transloco.translate('key') or transloco.translate('key', { params })
        const translocoMatches = [...text.matchAll(/(?:\w+\.)?transloco\.translate\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*\{[^}]*\})?\s*\)/g)];

        // Pattern 3: .translate('key') or .translate('key', { params }) - Generic translate method calls
        const genericTranslateMatches = [...text.matchAll(/\.translate\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*\{[^}]*\})?\s*\)/g)];

        // Process all matches
        const allMatches = [
            ...translocoServiceMatches,
            ...translocoMatches,
            ...genericTranslateMatches
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

    private calculateTranslationCoverage(): TranslationAnalysis {
        const missingInCommon: string[] = [];
        const missingInFyle: string[] = [];
        const missingInCo: string[] = [];
        const unusedTranslations: string[] = [];

        const commonTranslations = this.translationCache.get('common') || {};
        const fyleTranslations = this.translationCache.get('fyle') || {};
        const coTranslations = this.translationCache.get('co') || {};

        // Get all available translation keys from JSON files
        const allAvailableKeys = new Set<string>();
        this.extractAllKeysFromObject(commonTranslations, '', allAvailableKeys);
        this.extractAllKeysFromObject(fyleTranslations, '', allAvailableKeys);
        this.extractAllKeysFromObject(coTranslations, '', allAvailableKeys);

        // Check each used key for missing translations
        for (const key of this.allTranslationKeys) {
            const commonValue = this.getNestedValue(commonTranslations, key);
            const fyleValue = this.getNestedValue(fyleTranslations, key);
            const coValue = this.getNestedValue(coTranslations, key);

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

        if (totalMissing === 0) {
            vscode.window.showInformationMessage(
                `🎉 All translations are complete!\n\nTotal keys: ${analysis.totalKeys}\nCoverage: Common ${analysis.coveragePercentage.common}%, Fyle ${analysis.coveragePercentage.fyle}%, CO ${analysis.coveragePercentage.co}%`
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
            }
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

        // Watch for changes to translation JSON files
        const translationFilePattern = new vscode.RelativePattern(
            workspaceFolder,
            'src/assets/i18n/**/*.json'
        );

        const watcher = vscode.workspace.createFileSystemWatcher(translationFilePattern);

        // Handle file changes (create, change, delete) - OPTIMIZED VERSION
        const handleTranslationFileChange = (uri: vscode.Uri) => {
            const relativePath = vscode.workspace.asRelativePath(uri);
            console.log(`Translation file changed: ${relativePath}`);

            // Show a brief notification
            vscode.window.showInformationMessage(
                `Translation file updated: ${relativePath.split('/').pop()}. Updating coverage...`,
                { modal: false }
            );

            // Refresh translations (load new JSON values)
            this.refreshTranslations();

            // Only recalculate coverage without re-scanning source files
            this.recalculateTranslationCoverageOnly(statusBarItem);
        };

        // Register event handlers
        watcher.onDidCreate(handleTranslationFileChange);
        watcher.onDidChange(handleTranslationFileChange);
        watcher.onDidDelete((uri) => {
            const relativePath = vscode.workspace.asRelativePath(uri);
            console.log(`Translation file deleted: ${relativePath}`);

            // Show warning for file deletion
            vscode.window.showWarningMessage(
                `Translation file deleted: ${relativePath.split('/').pop()}. Updating coverage...`
            );

            // Refresh translations and recalculate coverage only
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

            console.log(`Source file changed: ${relativePath}`);
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
        watcher.onDidDelete((uri) => {
            const relativePath = vscode.workspace.asRelativePath(uri);
            console.log(`Source file deleted: ${relativePath}`);

            // Remove from cache
            this.fileAnalysisCache.delete(relativePath);

            // Trigger incremental analysis to update global keys
            this.rebuildGlobalKeysFromCache();
            this.analysisCache = this.calculateTranslationCoverage();
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

            if (document.languageId === 'html') {
                this.extractHtmlTranslationKeysWithLines(document.getText(), translationKeys, keyUsageMap);
            } else if (document.languageId === 'typescript') {
                this.extractTypeScriptTranslationKeysWithLines(document.getText(), translationKeys, keyUsageMap);
            }

            // Update cache
            this.fileAnalysisCache.set(filePath, {
                filePath,
                lastModified,
                translationKeys,
                keyUsageMap,
                fileSize: stats.size
            });

            console.log(`Updated analysis cache for ${filePath}: ${translationKeys.size} keys found`);
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
        console.log(`🔄 OPTIMIZED: Incremental analysis for ${changedFiles.length} files (vs full workspace scan)`);
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

            // Recalculate coverage
            this.analysisCache = this.calculateTranslationCoverage();
            this.lastAnalysisTime = new Date();

            // Update status bar
            this.updateAnalysisStatusBar(statusBarItem);

            const duration = Date.now() - startTime;
            const fileNames = changedFiles.map(f => vscode.workspace.asRelativePath(f)).join(', ');
            console.log(`✅ PERFORMANCE: Incremental analysis completed in ${duration}ms for ${changedFiles.length} files (${keysUpdated} keys updated)`);
            console.log(`📁 Files analyzed: ${fileNames}`);

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

        console.log(`Rebuilt global keys: ${this.allTranslationKeys.size} unique keys from ${this.fileAnalysisCache.size} files`);
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

    private recalculateTranslationCoverageOnly(statusBarItem: vscode.StatusBarItem): void {
        try {
            console.log('🚀 OPTIMIZED: Recalculating translation coverage (fast mode - no source file scan)');
            const startTime = Date.now();

            // Only recalculate coverage using existing translation keys
            this.analysisCache = this.calculateTranslationCoverage();
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

        for (const theme of ['common', 'fyle', 'co']) {
            const translations = this.translationCache.get(theme) || {};
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
        // Default to common translations file
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) return;

        const commonFilePath = path.join(workspaceFolder.uri.fsPath, 'src/assets/i18n/en.json');

        try {
            const fileContent = fs.readFileSync(commonFilePath, 'utf8');
            const translations = JSON.parse(fileContent);

            // Set nested value
            this.setNestedValue(translations, key, value);

            // Write back to file
            const updatedContent = JSON.stringify(translations, null, 2);
            fs.writeFileSync(commonFilePath, updatedContent, 'utf8');

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

