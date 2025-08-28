import { Component, Input, Output, EventEmitter, OnInit, ViewChild, forwardRef, inject } from '@angular/core';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { Dropdown } from 'primeng/dropdown';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],

  // Registers DropdownComponent as a ControlValueAccessor for Angular forms.
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements OnInit, ControlValueAccessor {
  @ViewChild('dropdown') dropdown!: Dropdown;

  private translocoService: TranslocoService = inject(TranslocoService);

  // Core inputs (existing)
  @Input() options: any[] = [];

  @Input() placeholder: string = '';

  @Input() form: FormGroup;

  @Input() formControllerName: string;

  @Input() displayKey: string = 'label';

  @Input() isDisabled: boolean = false;

  @Input() additionalClasses: string = '';

  @Input() isMultiLineOption: boolean = false;

  // New enhanced inputs
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Input() width: string = '';

  @Input() errorState: boolean = false;

  @Input() showFilter: boolean = false;

  @Input() filterFields: string[] = [];

  @Input() emptyMessage: string = this.translocoService.translate('dropdown.noResultsFound');

  @Input() loading: boolean = false;

  @Input() showClearIcon: boolean = false;

  @Input() customClass: string = '';

  @Input() optionLabel: string = 'label';

  @Input() optionValue: string = 'value';

  @Input() tooltipEnabled: boolean = true;

  @Input() multiLine: boolean = false;

  @Input() appendTo: string = 'body';

  @Input() brandId: string = 'fyle';

  // Events
  @Output() selectionChange = new EventEmitter<any>();

  @Output() filterChange = new EventEmitter<string>();

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

  ngOnInit() {
    this.setupFormValidation();
    this.applyBrandStyling();
  }

  private setupFormValidation() {
    if (this.form && this.formControllerName) {
      const control = this.form.get(this.formControllerName);
      if (control) {
        control.statusChanges.subscribe(status => {
          this.errorState = (status === 'INVALID' && control.touched) && !this.isSearchFocused;
        });
      }
    }
  }

  private applyBrandStyling() {
    // Brand-specific styling logic can be extended here
  }

  onSelectionChange(event: any) {
    this.value = event.value;
    this.selectionChange.emit(event);
    this.onChange(event.value);
    this.onTouched();
  }

  onFilter(event: any) {
    this.filterChange.emit(event.filter);
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
    if (this.errorState) {
      classes.push('app-dropdown-error');
    }
    if (this.loading) {
      classes.push('app-dropdown-loading');
    }
    if (this.customClass) {
      classes.push(this.customClass);
    }
    if (this.additionalClasses) {
      classes.push(this.additionalClasses);
    }
    return classes.join(' ');
  }

  getDropdownIcon(): string {
    if (this.loading) {
      return 'pi pi-spinner pi-spin';
    }
    return `pi pi-chevron-down ${this.brandId}`;
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
