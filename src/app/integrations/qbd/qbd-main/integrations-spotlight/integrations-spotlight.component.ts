import { Component, HostListener, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { AppUrl, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { Router } from '@angular/router';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { DialogModule } from 'primeng/dialog';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-integrations-spotlight',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule],
  templateUrl: './integrations-spotlight.component.html',
  styleUrls: ['./integrations-spotlight.component.scss']
})
export class IntegrationsSpotlightComponent implements OnInit, OnDestroy {
  @Input() isSpotlightOpen = false;

  @Output() toggleSpotlight = new EventEmitter<void>();

  @Output() selectOption = new EventEmitter<any>();

  @Output() actionSelected = new EventEmitter<string>();

  isLoading: boolean = false;

  isHelpClicked: boolean = false;

  showShimmer: boolean = false;

  searchQuery = '';

  helpQueryTitle = '';

  message: SafeHtml;

  showMessageDialog: boolean = false;

  isLoadingHelp: boolean = false;

  activeIndex: number = -1;
  allOptions: any[] = [];

  showHelpDialog: boolean = false;
  helpMessage: string = '';
  typedMessage: SafeHtml = '';
  typingSpeed: number = 30; // milliseconds per character

  constructor(
    private http: HttpClient,
    private workspaceService: QbdWorkspaceService,
    private helperService: HelperService,
    private routerService: Router,
    private toastService: IntegrationsToastService,
    private sanitizer: DomSanitizer
  ) {
    // Remove this subscription from the constructor
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.toggleSpotlight.emit();
    } else if (this.isSpotlightOpen) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.navigateOptions(1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.navigateOptions(-1);
          break;
        case 'Enter':
          event.preventDefault();
          if (this.activeIndex >= 0 && this.activeIndex < this.allOptions.length) {
            this.onSelectOption(this.allOptions[this.activeIndex]);
          }
          break;
      }
    }
  }

  onToggleSpotlight(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.closeSpotlight();
  }

  closeSpotlight() {
    if (this.isSpotlightOpen) {
      this.toggleSpotlight.emit();
      this.configOptions = [...this.defaultConfigOptions];
      this.iifOptions = [...this.defaultIifOptions];
      this.supportOptions = [...this.defaultSupportOptions];
      this.searchQuery= '';
      this.message = '';
      this.isHelpClicked = false;
      this.helpQueryTitle = '';
    }
  }

  onSelectOption(option: any) {
    if (option.type === 'action') {
      this.performAction(option.code);
    } else if (option.type === 'navigation') {
      this.performNavigate(option.url);
    } else if (option.type === 'help') {
      this.performHelp(option.description);
      return; // Don't close spotlight when showing help message
    }
    this.closeSpotlight();
  }

  onSearchInput() {
    this.showShimmer = true; // Show shimmer when search input changes
    this.searchSubject.next(this.searchQuery);
    this.activeIndex = -1; // Reset active index when search input changes
  }

  getUniqueByKey(array: any[], key: string): any[] {
    return Array.from(
      array.reduce((map, item) => map.set(item[key], item), new Map()).values()
    );
  }

  defaultIifOptions = [
    { type: "action", title: 'Export IIF file', code: 'trigger_export', description: 'Export the current data to an IIF file.', icon: "pi-file-export" }
  ];

  defaultConfigOptions = [
    { type: "navigation", title: 'Configuration', code: 'go_to_settings', description: 'Go to the configuration page.', icon: "pi-external-link", url: '/configuration/export_settings' }
  ];

  defaultSupportOptions = [
    { type: "help", code: 'date_filter_help', title: 'How to filter IIF files by date', description: 'How to filter by date in QBD?', icon: "pi-info-circle" }
  ];

  private performSearch(query: string) {
    this.helperService.setBaseApiURL(AppUrl.QBD);
    this.showShimmer = true; // Ensure shimmer is shown before API call

    this.workspaceService.spotlightQuery(query).subscribe(
      (response: any) => {
        this.iifOptions = this.getUniqueByKey([...response.actions, ...this.defaultIifOptions], 'code');
        this.configOptions = this.getUniqueByKey([...response.navigations, ...this.defaultConfigOptions], 'code');
        this.supportOptions = this.getUniqueByKey([...response.help, ...this.defaultSupportOptions], 'code');
        this.updateAllOptions();
        this.showShimmer = false; // Hide shimmer after data is loaded
      },
      error => {
        console.error('Error fetching search results:', error);
        this.showShimmer = false; // Hide shimmer on error
      }
    );
  }

  private updateAllOptions() {
    this.allOptions = [...this.iifOptions, ...this.configOptions, ...this.supportOptions];
  }

  private navigateOptions(direction: number) {
    this.activeIndex += direction;
    if (this.activeIndex < 0) {
      this.activeIndex = this.allOptions.length - 1;
    } else if (this.activeIndex >= this.allOptions.length) {
      this.activeIndex = 0;
    }
    this.scrollToActiveOption();
  }

  private scrollToActiveOption() {
    setTimeout(() => {
      const activeElement = document.querySelector('.search-result-item.active');
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  private performAction(code: string) {
    this.helperService.setBaseApiURL(AppUrl.QBD);
    this.workspaceService.spotlightAction(code).subscribe((response: any) => {
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, response.message);
      },
      error => {
        console.error('Error performing action:', error);
        this.toastService.displayToastMessage(ToastSeverity.ERROR, "Error performing action");
      }
    );
  }

  private performNavigate(code: string) {
  this.routerService.navigate(['/integrations/qbd/main/' + code]);
  }

  private performHelp(query: string) {
    this.isHelpClicked = true;
    this.helperService.setBaseApiURL(AppUrl.QBD);
    this.isLoadingHelp = true;
    this.helpQueryTitle = query;
    this.workspaceService.spotlightHelp(query).subscribe(
      (response: any) => {
        this.helpMessage = response.message;
        this.isLoadingHelp = false;
        this.showHelpDialog = true;
        this.typeMessage();
      },
      error => {
        console.error('Error fetching help:', error);
        this.toastService.displayToastMessage(ToastSeverity.ERROR, "Error fetching help information");
        this.isLoadingHelp = false;
        this.isHelpClicked = false;
        this.helpQueryTitle = '';
      }
    );
  }

  typeMessage() {
    const lines = this.helpMessage.split('\n');
    let formattedMessage = '';
    let currentIndex = 0;

    const typeNextCharacter = () => {
      if (currentIndex < lines.length) {
        const line = lines[currentIndex].trim();
        if (line) {
          formattedMessage += `<p class="typing-animation">${this.formatLine(line)}</p>`;
          this.typedMessage = this.sanitizer.bypassSecurityTrustHtml(formattedMessage);
        }
        currentIndex++;
      }
      
      if (currentIndex < lines.length) {
        setTimeout(typeNextCharacter, this.typingSpeed);
      }
    };

    typeNextCharacter();
  }

  formatLine(line: string): string {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return line.replace(urlRegex, (url) => `<a href="${url}" target="_blank" class="link-preview">${url}</a>`);
  }

  closeHelpDialog() {
    this.showHelpDialog = false;
    this.typedMessage = '';
    this.isHelpClicked = false;
    this.helpQueryTitle = '';
  }

  closeMessageDialog() {
    this.showMessageDialog = false;
  }

  iifOptions: any[] = [...this.defaultIifOptions];

  configOptions: any[] = [...this.defaultConfigOptions];

  supportOptions: any[] = [...this.defaultSupportOptions];

  private searchSubject = new Subject<string>();

  private searchSubscription: Subscription;

  ngOnInit() {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
    this.updateAllOptions(); // Initialize allOptions
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onDialogMaskClick(event: any) {
    // Check if the click target is the mask (overlay) itself
    if (event.target.classList.contains('p-dialog-mask')) {
      this.closeMessageDialog();
    }
  }
}
