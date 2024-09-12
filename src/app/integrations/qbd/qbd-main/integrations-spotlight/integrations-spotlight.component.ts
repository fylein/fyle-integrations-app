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
  styleUrl: './integrations-spotlight.component.scss'
})
export class IntegrationsSpotlightComponent implements OnInit, OnDestroy {
  @Input() isSpotlightOpen = false;

  @Output() toggleSpotlight = new EventEmitter<void>();

  @Output() selectOption = new EventEmitter<any>();

  @Output() actionSelected = new EventEmitter<string>();

  isLoading: boolean = false;
  showShimmer: boolean = false;

  searchQuery = '';

  message: SafeHtml;

  showMessageDialog: boolean = false;

  isLoadingHelp: boolean = false;

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
    }
  }

  onSelectOption(input: any) {
    console.log(input);
    if (input.type == 'action') {
      this.performAction(input.code);
    } else if (input.type == 'navigation') {
      this.performNavigate(input.url);
    } else if (input.type == 'help') {
      this.performHelp(input.description);
      return; // Don't close spotlight when showing help message
    }
    this.closeSpotlight();
  }

  onSearchInput() {
    this.showShimmer = true; // Show shimmer when search input changes
    this.searchSubject.next(this.searchQuery);
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
    console.log('performSearch called with query:', query);
    this.helperService.setBaseApiURL(AppUrl.QBD);
    this.showShimmer = true; // Ensure shimmer is shown before API call

    this.workspaceService.spotlightQuery(query).subscribe(
      (response: any) => {
        console.log('Server response:', response);
        this.iifOptions = this.getUniqueByKey([...response['actions'], ...this.defaultIifOptions], 'code');
        this.configOptions = this.getUniqueByKey([...response['navigations'], ...this.defaultConfigOptions], 'code');
        this.supportOptions = this.getUniqueByKey([...response['help'], ...this.defaultSupportOptions], 'code');
        this.showShimmer = false; // Hide shimmer after data is loaded
      },
      error => {
        console.error('Error fetching search results:', error);
        this.showShimmer = false; // Hide shimmer on error
      }
    );
  }

  private performAction(code: string) {
    this.helperService.setBaseApiURL(AppUrl.QBD);
    this.workspaceService.spotlightAction(code).subscribe((response: any) => {
        console.log('Server response:', response);
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, response.message);
      },
      error => {
        console.error('Error performing action:', error);
        this.toastService.displayToastMessage(ToastSeverity.ERROR, "Error performing action");
      }
    );
  }

  private performNavigate(code: string) {
    console.log(code);
  this.routerService.navigate(['/integrations/qbd/main/' + code]);
  }  

  private performHelp(query: string) {
    this.helperService.setBaseApiURL(AppUrl.QBD);
    this.isLoadingHelp = true;
    this.showMessageDialog = true;
    this.workspaceService.spotlightHelp(query).subscribe(
      (response: any) => {
        this.message = this.sanitizer.bypassSecurityTrustHtml(
          response.message
            .split('\n')
            .map((line: string) => `<p>${this.linkify(line.trim())}</p>`)
            .join('')
        );
        this.isLoadingHelp = false;
      },
      error => {
        console.error('Error fetching help:', error);
        this.toastService.displayToastMessage(ToastSeverity.ERROR, "Error fetching help information");
        this.isLoadingHelp = false;
        this.showMessageDialog = false;
      }
    );
  }

  private linkify(text: string): string {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => `<a href="${url}" target="_blank" class="light-blue-link">${url}</a>`);
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
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
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
