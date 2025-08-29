import { Component, Input, Output, EventEmitter, OnInit, ViewChild, forwardRef, inject } from '@angular/core';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { Dropdown, DropdownFilterEvent } from 'primeng/dropdown';
import { brandingConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],

  // Registers DropdownComponent as a ControlValueAccessor for Angular forms.
  // Used for creating forms dynamically, validation, two-way binding, etc.
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // Standard Angular pattern for ControlValueAccessor
      // eslint-disable-next-line no-use-before-define
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements ControlValueAccessor {
  @ViewChild('dropdown') dropdown!: Dropdown;

  private translocoService: TranslocoService = inject(TranslocoService);

  // Available only to template
  protected brandingConfig = brandingConfig;

  // Core inputs (existing)
  @Input() options: any[] = [];

  @Input() placeholder: string = '';

  @Input() form: FormGroup;

  @Input() formControllerName: string;

  // Used in template-driven p-dropdowns - property key to display
  @Input() displayKey: string = '';

  @Input() isDisabled: boolean = false;

  @Input() additionalClasses: string = '';

  // New enhanced inputs
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Input() errorState: boolean = false;

  @Input() showFilter: boolean = false;

  @Input() filterFields: string[] = [];

  @Input() emptyFilterMessage: string = this.translocoService.translate('dropdown.noResultsFound');

  @Input() showClearIcon: boolean = false;

  // Used in reactive p-dropdowns
  @Input() optionLabel: string;

  @Input() optionValue: string;

  @Input() tooltipEnabled: boolean = true;

  @Input() isMultiLineOption: boolean = false;

  @Input() subLabel: string;

  @Input() appendTo: string = 'body';

  // Events
  @Output() selectionChange = new EventEmitter<any>();

  @Output() filterChange = new EventEmitter<DropdownFilterEvent>();

  @Output() clearSelection = new EventEmitter<void>();

  @Output() dropdownShow = new EventEmitter<void>();

  @Output() dropdownHide = new EventEmitter<void>();

  // Internal state
  protected value: any;

  private isSearchFocused: boolean = false;

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};

  private onTouched = () => {};

  constructor() { }

  onSelectionChange(event: any) {
    this.value = event.value;
    this.selectionChange.emit(event);
    this.onChange(event.value);
    this.onTouched();
  }

  onFilter(event: any) {
    this.filterChange.emit(event);
  }

  onSearchFocus(focused: boolean) {
    this.isSearchFocused = focused;
  }

  clearDropdown() {
    this.value = null;
    if (this.form && this.formControllerName) {
      this.form.get(this.formControllerName)?.setValue(null);
    }
    this.clearSelection.emit();
    this.onChange(null);
  }

  onDropdownShow() {
    this.dropdownShow.emit();
  }

  onDropdownHide() {
    this.dropdownHide.emit();
  }

  // Helper methods for templates
  getDropdownContainerClasses(): string {
    const classes = ['app-dropdown'];
    classes.push(`app-dropdown-${this.size}`);
    if (this.additionalClasses) {
      classes.push(this.additionalClasses);
    }
    return classes.join(' ');
  }

  getDropdownClasses(): string {
    return this.errorState ? 'error-box' : 'normal-box';
  }

  isOverflowing(element: HTMLElement, option: any): boolean {
    if (!this.tooltipEnabled || !element) {
      return false;
    }
    return element.offsetWidth < element.scrollWidth;
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.value = value;
    if (this.form && this.formControllerName) {
      this.form.get(this.formControllerName)?.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
