import { Component, Input, Output, EventEmitter, OnInit, ViewChild, forwardRef, inject } from '@angular/core';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { Dropdown, DropdownFilterEvent } from 'primeng/dropdown';
import { brandingConfig } from 'src/app/branding/branding-config';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';

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
  // Available only to template
  protected brandingConfig = brandingConfig;

  @Input() options: any[] = [];

  @Input() placeholder: string = '';

  @Input() form: FormGroup;

  @Input() formControllerName: string;

  // Used in template-driven p-dropdowns - property key to display
  @Input() displayKey: string = '';

  @Input() isDisabled: boolean = false;

  @Input() customClasses: string = '';

  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Input() errorState: boolean = false;

  @Input() showSearchFilter: boolean = false;

  @Input() filterFields: string[] = [];

  @Input() isLoading: boolean = false;

  @Input() showClearIcon: boolean = false;

  @Input() isFieldMandatory: boolean = false;

  // Used in reactive p-dropdowns
  @Input() optionLabel: string;

  @Input() optionValue: string;

  @Input() tooltipEnabled: boolean = true;

  @Input() isMultiLineOption: boolean = false;

  @Input() convertOptionsToSentenceCase: boolean = false;

  @Input() subLabelKey: string;

  @Input() appendTo: string = 'body';

  // Events
  @Output() selectionChange = new EventEmitter<any>();

  @Output() filterChange = new EventEmitter<DropdownFilterEvent>();

  @Output() clearSelection = new EventEmitter<void>();

  @Output() dropdownShow = new EventEmitter<void>();

  @Output() dropdownHide = new EventEmitter<void>();

  private isSearchFocused: boolean = false;

  private translocoService: TranslocoService = inject(TranslocoService);

  // Internal state
  protected value: any;

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};

  private onTouched = () => {};

  constructor() { }

  // Helper methods for templates
  protected get emptyFilterMessage(): string {
    if (this.isLoading) {
      return this.translocoService.translate('dropdown.searching');
    }
    return this.translocoService.translate('dropdown.noResultsFound');
  }

  protected get isInvalid(): boolean {
    return this.form.controls?.[this.formControllerName]?.invalid && this.isFieldMandatory && this.form.controls?.[this.formControllerName]?.touched && !this.isSearchFocused;
  }

  getDropdownContainerClasses(): string {
    const classes = ['app-dropdown'];
    classes.push(`app-dropdown-${this.size}`);
    return classes.join(' ');
  }

  getDropdownClasses(): string {
    const classes = [ this.isInvalid ? 'error-box' : 'normal-box' ];

    if (this.showClearIcon && !this.isDisabled && this.form.controls?.[this.formControllerName]?.value) {
      classes.push('showClearIcon');
    }
    if (this.customClasses) {
      classes.push(this.customClasses);
    }
    return classes.join(' ');
  }

  getDisplayText(option: any): string {
    const displayText = this.displayKey ? option[this.displayKey] : option;
    if (this.convertOptionsToSentenceCase) {
      return new SentenceCasePipe(this.translocoService).transform(displayText);
    }
    return displayText;
  }

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

  isOverflowing(element: HTMLElement): boolean {
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
