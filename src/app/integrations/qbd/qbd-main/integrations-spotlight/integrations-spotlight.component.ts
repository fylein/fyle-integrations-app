import { Component, HostListener, Output, EventEmitter, Input } from '@angular/core';
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
export class IntegrationsSpotlightComponent {
  @Input() isSpotlightOpen = false;
  @Input() iifOptions: any[] = [];
  @Input() configOptions: any[] = [];
  @Input() supportOptions: any[] = [];
  @Output() toggleSpotlight = new EventEmitter<void>();
  @Output() selectOption = new EventEmitter<any>();

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
    console.log('anish', this.isSpotlightOpen);
  }

  onSelectOption(option: any) {
    if (option.category === 'Action') {
      this.http.post('/actions', { CODE: option.code }).subscribe(
        () => {
          console.log('Action triggered successfully');
          this.selectOption.emit(option);
        },
        error => console.error('Error triggering action:', error)
      );
    } else if (option.category === 'Help') {
      this.http.post('/help', { query: option.label }).subscribe(
        (response: any) => {
          console.log('Help message:', response.Message);
          this.selectOption.emit({ ...option, helpMessage: response.Message });
        },
        error => console.error('Error fetching help:', error)
      );
    } else if (option.category === 'Navigation') {
      this.selectOption.emit(option);
    }
  }

  onSearchInput() {
    this.searchSubject.next(this.searchQuery);
  }

  private performSearch(query: string) {
    if (!query) {
      this.filteredOptions = [];
      return;
    }

    this.http.post('/query', { query }).subscribe(
      (response: any) => {
        this.filteredOptions = [
          ...response.actions.map((action: any) => ({
            label: action.title,
            icon: 'pi-bolt',
            category: 'Action',
            code: action.code
          })),
          ...response.help.map((help: any) => ({
            label: help.title,
            icon: 'pi-question-circle',
            category: 'Help',
            description: help.description
          })),
          ...response.navigation.map((nav: any) => ({
            label: nav.title,
            icon: 'pi-link',
            category: 'Navigation',
            url: nav.url
          }))
        ];
      },
      error => {
        console.error('Error fetching search results:', error);
        this.filteredOptions = [];
      }
    );
  }

  filteredOptions: any[] = [];
  private searchSubject = new Subject<string>();

  constructor(private http: HttpClient) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => this.performSearch(query));
  }
}
