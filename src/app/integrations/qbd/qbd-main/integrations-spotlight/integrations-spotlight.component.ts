import { Component, HostListener, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-integrations-spotlight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './integrations-spotlight.component.html',
  styleUrl: './integrations-spotlight.component.scss'
})
export class IntegrationsSpotlightComponent implements OnInit {
  @Input() isSpotlightOpen = false;

  @Input() iifOptions: any[] = [];

  @Input() configOptions: any[] = [];

  @Input() supportOptions: any[] = [];

  @Output() toggleSpotlight = new EventEmitter<void>();

  @Output() selectOption = new EventEmitter<any>();

  @Output() actionSelected = new EventEmitter<string>();

  searchQuery = '';

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
    }
  }

  onSelectOption(option: any) {
    console.log('onSelectOption called with option:', option);
    option.action();
    this.closeSpotlight();
  }

  onSearchInput() {
    console.log('onSearchInput called with query:', this.searchQuery);
    this.searchSubject.next(this.searchQuery);
  }

  private performSearch(query: string) {
    console.log('performSearch called with query:', query);
    this.filteredOptions = [];
    if (!query) {
      console.log('Query is empty, showing all options');
      // If query is empty, show all options
      this.filteredOptions = [...this.iifOptions, ...this.configOptions, ...this.supportOptions];
      return;
    }

    const lowerQuery = query.toLowerCase();
    console.log('Lowercase query:', lowerQuery);

    // Filter local options
    this.filteredOptions = [
      ...this.iifOptions.filter(option => option.label.toLowerCase().includes(lowerQuery)),
      ...this.configOptions.filter(option => option.label.toLowerCase().includes(lowerQuery)),
      ...this.supportOptions.filter(option => option.label.toLowerCase().includes(lowerQuery))
    ];
    console.log('Filtered local options:', this.filteredOptions);

    // Fetch additional results from the server
    this.http.post('api/workspaces/2/spotlight/query/', { query }).subscribe(
      (response: any) => {
        console.log('Server response:', response);
        // ... existing code to process server response ...
        console.log('Final filtered options:', this.filteredOptions);
      },
      error => {
        console.error('Error fetching search results:', error);
      }
    );
  }

  filteredOptions: any[] = [];

  private searchSubject = new Subject<string>();

  constructor(private http: HttpClient) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      console.log('searchSubject emitted query:', query);
      this.performSearch(query);
    });
  }

  ngOnInit() {
    // Perform initial search
    // this.performSearch(this.searchQuery);
  }
}
