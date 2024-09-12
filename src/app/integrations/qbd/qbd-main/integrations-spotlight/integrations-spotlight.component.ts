import { Component, HostListener, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { AppUrl, QBDOnboardingState } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-integrations-spotlight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './integrations-spotlight.component.html',
  styleUrl: './integrations-spotlight.component.scss'
})
export class IntegrationsSpotlightComponent implements OnInit {
  @Input() isSpotlightOpen = false;

  @Output() toggleSpotlight = new EventEmitter<void>();

  @Output() selectOption = new EventEmitter<any>();

  @Output() actionSelected = new EventEmitter<string>();

  searchQuery = '';

  constructor(
    private http: HttpClient,
    private workspaceService: QbdWorkspaceService,
    private helperService: HelperService
  ) {
      // Logic from the first constructor
      this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(query => {
        console.log('searchSubject emitted query:', query);
        this.performSearch(query);
      });
      
      // You can add any additional logic required for workspaceService and helperService here
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
      this.configOptions = [...this.defaultSupportOptions];
      this.iifOptions = [...this.defaultIifOptions];
      this.supportOptions = [...this.defaultSupportOptions];
      this.searchQuery= '';
    }
  }

  onSelectOption(option: any) {
    option.action();
    this.closeSpotlight();
  }

  onSearchInput() {
    this.searchSubject.next(this.searchQuery);
  }
  
  getUniqueByKey(array: any[], key: string): any[] {
    return Array.from(
      array.reduce((map, item) => map.set(item[key], item), new Map()).values()
    );
  }

  defaultIifOptions = [
    { title: 'Export IIF file', code: 'trigger_export', description: 'Export the current data to an IIF file.' }
  ];

  defaultConfigOptions = [
    { title: 'Configuration', code: 'go_to_settings', description: 'Go to the configuration page.' }
  ];

  defaultSupportOptions = [
    {code: 'date_filter_help', title: 'How to filter IIF files by date', description: 'How to filter by date in QBD?' }
  ];

  private performSearch(query: string) {
    console.log('performSearch called with query:', query);
    this.helperService.setBaseApiURL(AppUrl.QBD);

    // Fetch additional results from the server
    this.workspaceService.spotlightQuery(query).subscribe((response: any) => {
        console.log('Server response:', response);
        this.iifOptions = this.getUniqueByKey([...response['actions'], ...this.defaultIifOptions], 'code');
        this.configOptions = this.getUniqueByKey([...response['navigations'], ...this.defaultConfigOptions], 'code');
        this.supportOptions = this.getUniqueByKey([...response['help'], ...this.defaultSupportOptions], 'code');

      },
      error => {
        console.error('Error fetching search results:', error);
      }
    );
  }

  iifOptions: any[] = [...this.defaultIifOptions];
  configOptions: any[] = [...this.defaultConfigOptions];
  supportOptions: any[] = [...this.defaultSupportOptions];


  private searchSubject = new Subject<string>();

  ngOnInit() {
    // Perform initial search
    // This.performSearch(this.searchQuery);
  }
}
