import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { ExportSettingFormOption } from 'src/app/core/models/intacct/intacct-configuration/export-settings.model';
import { AppName, DestinationOptionKey, IntacctCorporateCreditCardExpensesObject, IntacctExportSettingDestinationOptionKey, NetsuiteExportSettingDestinationOptionKey, QboExportSettingDestinationOptionKey } from 'src/app/core/models/enum/enum.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { AdvancedSettingFormOption, HourOption } from 'src/app/core/models/intacct/intacct-configuration/advanced-settings.model';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { IntacctDestinationAttribute } from 'src/app/core/models/intacct/db/destination-attribute.model';
import { Sage300DestinationAttributes } from 'src/app/core/models/sage300/db/sage300-destination-attribuite.model';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { TravelperkDestinationAttribuite } from 'src/app/core/models/travelperk/travelperk.model';
import { ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { interval } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-configuration-select-field',
  templateUrl: './configuration-select-field.component.html',
  styleUrls: ['./configuration-select-field.component.scss']
})
export class ConfigurationSelectFieldComponent implements OnInit, OnChanges {

  @Input() options: QBDExportSettingFormOption[] | string[] | ExportSettingFormOption[] | AdvancedSettingFormOption[] | HourOption[] | SelectFormOption[];

  // TODO: kill app specific type
  @Input() destinationAttributes: IntacctDestinationAttribute[] | Sage300DestinationAttributes[] | DestinationAttribute[] | DefaultDestinationAttribute[] | TravelperkDestinationAttribuite[];

  @Input() form: FormGroup;

  @Input() iconPath: string;

  @Input() label: string;

  @Input() subLabel: string | SafeHtml;

  @Input() placeholder: string;

  @Input() formControllerName: string;

  @Input() simpleOptions: string[];

  @Input() isFieldMandatory: boolean;

  @Input() mandatoryErrorListName: string;

  @Input() customErrorMessage: string;

  @Input() showClearIcon: boolean = false;

  @Input() appName: string;

  @Input() exportConfigurationIconPath: string;

  @Input() exportTypeIconPathArray: any;

  @Input() isDefaultFields: boolean = false;

  @Input() destinationOptionKey: DestinationOptionKey;

  @Input() isOptionSearchInProgress: boolean;

  @Input() isDisabled: boolean = false;

  @Input() optionLabel: string = 'value';

  @Input() showExportPreview: boolean = false;

  @Input() isAdvanceSearchEnabled: boolean;

  @Input() isMultiLineOption: boolean = false;

  @Input() isDisableTextRequired: boolean = true;

  @Input() isimportSettings: boolean = false;

  @Output() searchOptionsDropdown: EventEmitter<ExportSettingOptionSearch> = new EventEmitter<ExportSettingOptionSearch>();

  exportTypeIconPath: string;

  uiExposedAppName: string;

  meridiemOption: string[];

  timeOption: string[] = ['01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];

  isPreviewDialogVisible: boolean = false;

  exportType: string;

  isOnboarding: boolean = false;

  isCCCExportTableVisible: boolean = false;

  IntacctCorporateCreditCardExpensesObject = IntacctCorporateCreditCardExpensesObject;

  optionsCopy: any[];

  exportTableData: { exportModule: string; employeeMapping: string; chartOfAccounts: string; sageIntacctModule: string; }[];

  dialogHeader: string;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly AppName = AppName;

  isSearchFocused: boolean = false;

  readonly brandingStyle = brandingStyle;

  constructor(
    private trackingService: TrackingService,
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  onSearchFocus(isSearchFocused: boolean): void {
    this.isSearchFocused = isSearchFocused;
  }

  removeFilter(formField: AbstractControl) {
    (formField as FormGroup).reset();
    event?.stopPropagation();
  }

  isOverflowing(element: any): boolean {
    return element.offsetWidth < element.scrollWidth;
  }

  showExportTable() {
    this.dialogHeader = this.translocoService.translate(this.appName === AppName.TRAVELPERK ? 'configurationSelectField.preview' : 'configurationSelectField.exportModule');
    this.exportTypeIconPath = this.exportConfigurationIconPath;
    this.isPreviewDialogVisible = true;
  }

  showExportPreviewDialog(exportType: string) {
    this.dialogHeader = this.translocoService.translate('configurationSelectField.previewOfExport', { exportType: new SnakeCaseToSpaceCasePipe().transform(exportType.toLowerCase()), appName: this.appName });
    const index = this.formControllerName === 'reimbursableExportType' ? 0 : 1;
    this.exportTypeIconPath = this.exportTypeIconPathArray[index][exportType];
    this.isPreviewDialogVisible = true;
  }

  closeDialog() {
    this.isPreviewDialogVisible = false;
  }

  simpleSearch(query: string) {
    this.destinationAttributes = this.optionsCopy.filter(attribute => attribute.name?.toLowerCase().includes(query.toLowerCase()) || attribute.value?.toLowerCase().includes(query.toLowerCase()));
  }

  clearSearch(): void {
    this.form.controls.searchOption.patchValue('');
  }

  searchOptions(event: any) {
    const searchTerm = (event.filter as string).trim();
    if (!searchTerm) {
 return;
}

    this.searchOptionsDropdown.emit({ searchTerm: searchTerm, destinationAttributes: this.destinationAttributes, destinationOptionKey: this.destinationOptionKey, formControllerName: this.formControllerName});
  }

  ngOnInit(): void {
    this.meridiemOption = [this.translocoService.translate('configurationSelectField.am'), this.translocoService.translate('configurationSelectField.pm')];
    this.exportTableData = [
      { exportModule: this.translocoService.translate('configurationSelectField.expenseReport'), employeeMapping: this.translocoService.translate('configurationSelectField.employee'), chartOfAccounts: this.translocoService.translate('configurationSelectField.expenseTypes'), sageIntacctModule: this.translocoService.translate('configurationSelectField.timeAndExpense') },
      { exportModule: this.translocoService.translate('configurationSelectField.bill'), employeeMapping: this.translocoService.translate('configurationSelectField.vendor'), chartOfAccounts: this.translocoService.translate('configurationSelectField.glAccounts'), sageIntacctModule: this.translocoService.translate('configurationSelectField.accountsPayable') },
      { exportModule: this.translocoService.translate('configurationSelectField.journalEntry'), employeeMapping: this.translocoService.translate('configurationSelectField.employeeVendor'), chartOfAccounts: this.translocoService.translate('configurationSelectField.glAccounts'), sageIntacctModule: this.translocoService.translate('configurationSelectField.generalLedger') }
    ];
    this.uiExposedAppName = this.appName === AppName.QBD_DIRECT ? AppName.QBD : this.appName;
    this.isOnboarding = this.router.url.includes('onboarding');
    if (this.destinationAttributes) {
      this.optionsCopy = this.destinationAttributes.slice();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isDisabled?.currentValue) {
      this.form.get(this.formControllerName)?.disable();
    } else if (!changes.isDisabled?.currentValue) {
      this.form.get(this.formControllerName)?.enable();
    }

    if (this.destinationAttributes){ /* Refreshing options to fix primeng dropdown search issue */
    this.optionsCopy = this.destinationAttributes;
    this.destinationAttributes = [...this.optionsCopy];
    }
  }
}
