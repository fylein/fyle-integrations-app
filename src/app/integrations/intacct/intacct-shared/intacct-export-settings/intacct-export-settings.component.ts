import { Component, Inject, OnInit } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject, debounceTime, filter, forkJoin } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { DefaultDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { CCCExpenseState, ConfigurationCta, IntacctCorporateCreditCardExpensesObject, FyleField, ExpenseGroupedBy, ExpenseState, ExportDateType, IntacctReimbursableExpensesObject, ExpenseGroupingFieldOption, Page, ToastSeverity, IntacctOnboardingState, ProgressPhase, IntacctUpdateEvent, AppName, IntacctExportSettingDestinationOptionKey, TrackingApp, EmployeeFieldMapping, ConfigurationWarningEvent } from 'src/app/core/models/enum/enum.model';
import { ExportSettingDestinationAttributeOption, IntacctDestinationAttribute, PaginatedintacctDestinationAttribute } from 'src/app/core/models/intacct/db/destination-attribute.model';
import { ExportSettingFormOption, ExportSettingGet, IntacctExportSettingOptionSearch } from 'src/app/core/models/intacct/intacct-configuration/export-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiExportSettingsService } from 'src/app/core/services/si/si-configuration/si-export-settings.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { TranslocoService } from '@jsverse/transloco';
import { ExportSettingsService } from 'src/app/core/services/common/export-settings.service';
import { BrandingService } from 'src/app/core/services/common/branding.service';

@Component({
  selector: 'app-intacct-export-settings',
  templateUrl: './intacct-export-settings.component.html',
  styleUrls: ['./intacct-export-settings.component.scss']
})
export class IntacctExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  isDialogClicked: boolean = true;

  exportSettingsForm: FormGroup;

  redirectLink = brandingKbArticles.onboardingArticles.INTACCT.EXPORT_SETTING;

  isOnboarding: boolean;

  saveInProgress: boolean = false;

  isConfirmationDialogVisible: boolean;

  warningDialogText: string;

  ConfigurationCtaText = ConfigurationCta;

  IntacctReimbursableExpensesObject = IntacctReimbursableExpensesObject;

  IntacctCorporateCreditCardExpensesObject = IntacctCorporateCreditCardExpensesObject;

  expenseStateOptions: ExportSettingFormOption[];

  cccExpenseStateOptions: ExportSettingFormOption[];

  exportSettings: ExportSettingGet;

  customMessage: string;

  splitExpenseGroupingOptions: SelectFormOption[];

  destinationOptions: ExportSettingDestinationAttributeOption = {
    [IntacctExportSettingDestinationOptionKey.ACCOUNT]: [],
    [IntacctExportSettingDestinationOptionKey.EXPENSE_PAYMENT_TYPE]: [],
    [IntacctExportSettingDestinationOptionKey.CCC_EXPENSE_PAYMENT_TYPE]: [],
    [IntacctExportSettingDestinationOptionKey.VENDOR]: [],
    [IntacctExportSettingDestinationOptionKey.CHARGE_CARD]: []
  };

  IntacctExportSettingDestinationOptionKey = IntacctExportSettingDestinationOptionKey;

  isOptionSearchInProgress: boolean;

  appName: string = AppName.INTACCT;

  private sessionStartTime = new Date();

  previewImagePaths =[
    {
      'EXPENSE_REPORT': 'assets/illustrations/sageIntacct/Reimbursable - Expense Report.jpg',
      'BILL': 'assets/illustrations/sageIntacct/Reimbursable Bill.jpg',
      'JOURNAL_ENTRY': 'assets/illustrations/sageIntacct/Reimbursable Journal Entry.jpg'
    },
    {
      'EXPENSE_REPORT': 'assets/illustrations/sageIntacct/CCC Expense Report.jpg',
      'BILL': 'assets/illustrations/sageIntacct/CCC Bill.jpg',
      'JOURNAL_ENTRY': 'assets/illustrations/sageIntacct/CCC Journal Entry.jpg',
      'CHARGE_CARD_TRANSACTION': 'assets/illustrations/sageIntacct/CCC Credit Card Purchase.jpg'
    }
  ];

  coPreviewImagePaths =[
    {
      'EXPENSE_REPORT': '',
      'BILL': '',
      'JOURNAL_ENTRY': ''
    },
    {
      'BILL': 'assets/illustrations/sageIntacct/coBill.svg',
      'JOURNAL_ENTRY': 'assets/illustrations/sageIntacct/coJournalEntry.svg',
      'CHARGE_CARD_TRANSACTION': 'assets/illustrations/sageIntacct/coChargeCard.svg'
    }
  ];

  expenseGroupingFieldOptions: ExportSettingFormOption[];

  reimbursableExpenseGroupingDateOptions: SelectFormOption[] = [];

  cccExpenseGroupingDateOptions: SelectFormOption[] = [];

  creditCardExportTypes: ExportSettingFormOption[];

  autoMapEmployeeOptions: ExportSettingFormOption[];

  reimbursableExportTypes: ExportSettingFormOption[];

  employeeFieldOptions: ExportSettingFormOption[];

  private optionSearchUpdate = new Subject<IntacctExportSettingOptionSearch>();

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingConfig = brandingConfig;

  isMultiLineOption: boolean;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private exportSettingService: SiExportSettingsService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: SiWorkspaceService,
    private mappingService: SiMappingsService,
    private sanitizer: DomSanitizer,
    private translocoService: TranslocoService,
    private exportSettingsService: ExportSettingsService,
    public brandingService: BrandingService
    ) {
    this.splitExpenseGroupingOptions = this.exportSettingsService.getSplitExpenseGroupingOptions();
    this.reimbursableExpenseGroupingDateOptions = this.exportSettingsService.getExpenseGroupingDateOptions();
    this.creditCardExportTypes = this.exportSettingsService.constructCCCOptions(brandingConfig.brandId);
    this.expenseGroupingFieldOptions = [
      {
        label: this.translocoService.translate('intacctExportSettings.expense'),
        value: ExpenseGroupingFieldOption.EXPENSE_ID
      },
      {
        label: this.translocoService.translate('intacctExportSettings.report'),
        value: ExpenseGroupingFieldOption.CLAIM_NUMBER
      }
    ];

    this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();

    this.autoMapEmployeeOptions = [
      { label: this.translocoService.translate('intacctExportSettings.emailIdMapping'), value: 'EMAIL' },
      { label: this.translocoService.translate('intacctExportSettings.nameMapping'), value: 'NAME' },
      { label: this.translocoService.translate('intacctExportSettings.employeeCodeMapping'), value: 'EMPLOYEE_CODE' }
    ];

    this.reimbursableExportTypes = [
      {
        label: this.translocoService.translate('intacctExportSettings.bill'),
        value: IntacctReimbursableExpensesObject.BILL
      },
      {
        label: this.translocoService.translate('intacctExportSettings.expenseReport'),
        value: IntacctReimbursableExpensesObject.EXPENSE_REPORT
      },
      {
        label: this.translocoService.translate('intacctExportSettings.journalEntry'),
        value: IntacctReimbursableExpensesObject.JOURNAL_ENTRY
      }
    ];

    this.employeeFieldOptions = [
      {
        label: this.translocoService.translate('intacctExportSettings.employee'),
        value: FyleField.EMPLOYEE
      },
      {
        label: this.translocoService.translate('intacctExportSettings.vendor'),
        value: FyleField.VENDOR
      }
    ];
  }

    refreshDimensions(isRefresh: boolean) {
      this.mappingService.refreshSageIntacctDimensions().subscribe();
      this.mappingService.refreshFyleDimensions().subscribe();
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('intacctExportSettings.syncDataDimensionsToast'));
    }

    getEmployeeFieldMapping(employeeFieldMapping: FyleField | null, reimbursableExportType: string): string {
      let employeeFieldMappingLabel = '';
      if (employeeFieldMapping) {
        employeeFieldMappingLabel = employeeFieldMapping;
      } else if (reimbursableExportType === IntacctReimbursableExpensesObject.JOURNAL_ENTRY) {
        employeeFieldMappingLabel = this.exportSettingsForm.controls.employeeFieldMapping.value;
      } else {
        employeeFieldMappingLabel = reimbursableExportType === IntacctReimbursableExpensesObject.EXPENSE_REPORT ? FyleField.EMPLOYEE : FyleField.VENDOR;
      }

      return new LowerCasePipe().transform(employeeFieldMappingLabel);
    }

    getExportType(exportType: IntacctReimbursableExpensesObject | IntacctCorporateCreditCardExpensesObject | null): string {
      if (exportType) {
        const lowerCaseWord = exportType.toLowerCase();
          return lowerCaseWord.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
      }

      return 'export';
    }

    private setUpExpenseStates(): void {
      this.cccExpenseStateOptions = [
        {
          label: this.translocoService.translate('intacctExportSettings.approved'),
          value: CCCExpenseState.APPROVED
        },
        {
          label: this.translocoService.translate('intacctExportSettings.closed'),
          value: CCCExpenseState.PAID
        }
      ];

      this.expenseStateOptions = [
        {
          label: this.translocoService.translate('intacctExportSettings.processing'),
          value: ExpenseState.PAYMENT_PROCESSING
        },
        {
          label: this.translocoService.translate('intacctExportSettings.closed'),
          value: ExpenseState.PAID
        }
      ];
    }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/intacct/onboarding/connector`]);
  }

  private isAdvancedSettingAffected(): boolean {
    return (this.exportSettings?.configurations?.reimbursable_expenses_object !== null && this.exportSettings?.configurations?.reimbursable_expenses_object !== IntacctReimbursableExpensesObject.JOURNAL_ENTRY && this.exportSettingsForm.value.reimbursableExportType === IntacctReimbursableExpensesObject.JOURNAL_ENTRY) || (this.exportSettings?.configurations?.corporate_credit_card_expenses_object !== null && this.exportSettings?.configurations?.corporate_credit_card_expenses_object !== IntacctCorporateCreditCardExpensesObject.JOURNAL_ENTRY && this.exportSettingsForm.value.creditCardExportType === IntacctCorporateCreditCardExpensesObject.JOURNAL_ENTRY);
  }

  private replaceContentBasedOnConfiguration(updatedConfiguration: string, existingConfiguration: string | undefined | null, exportType: string): string {
    let content = '';
    // If both are not none and it is an update case else for the new addition case
    if (updatedConfiguration && existingConfiguration) {
      content = this.translocoService.translate('intacctExportSettings.advancedSettingsWarning', { exportType: exportType, existingExportType: existingConfiguration.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()), updatedExportType: updatedConfiguration.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()) });
    }

    return content;
  }

  private constructWarningMessage(): string {
    let content: string = '';
    const existingReimbursableExportType = this.exportSettings?.configurations?.reimbursable_expenses_object;
    const existingCorporateCardExportType = this.exportSettings?.configurations?.corporate_credit_card_expenses_object;

    const updatedReimbursableExportType = this.exportSettingsForm.value.reimbursableExportType ? this.exportSettingsForm.value.reimbursableExportType : null;
    const updatedCorporateCardExportType = this.exportSettingsForm.value.creditCardExportType ? this.exportSettingsForm.value.creditCardExportType : null;

    let updatedExportType;
    let existingExportType;
    let exportType;

    if (existingReimbursableExportType !== updatedReimbursableExportType) {
      updatedExportType = updatedReimbursableExportType.replace(/_/g, ' ');
      existingExportType = existingReimbursableExportType?.replace(/_/g, ' ');
      exportType = this.translocoService.translate('intacctExportSettings.reimbursable');
    } else if (existingCorporateCardExportType !== updatedCorporateCardExportType) {
      updatedExportType = updatedCorporateCardExportType.replace(/_/g, ' ');
      existingExportType = existingCorporateCardExportType?.replace(/_/g, ' ');
      exportType = this.translocoService.translate('intacctExportSettings.creditCard');
    }

    if (this.isAdvancedSettingAffected() && exportType) {
      content = this.replaceContentBasedOnConfiguration(updatedExportType, existingExportType, exportType);
    }

    return content;
  }


    private reimbursableExportTypeWatcher(): void {
      this.exportSettingsForm.controls.reimbursableExportType.valueChanges.subscribe((isreimbursableExportTypeSelected) => {
        if (isreimbursableExportTypeSelected === IntacctReimbursableExpensesObject.JOURNAL_ENTRY) {
          this.exportSettingsForm.controls.glAccount.setValidators(Validators.required);
          this.exportSettingsForm.controls.employeeFieldMapping.enable();
        } else {
          this.exportSettingsForm.controls.glAccount.setValue(null);
          this.exportSettingsForm.controls.glAccount.clearValidators();
        }

        if (isreimbursableExportTypeSelected === IntacctReimbursableExpensesObject.EXPENSE_REPORT) {
          this.exportSettingsForm.controls.employeeFieldMapping.patchValue(FyleField.EMPLOYEE);
          this.exportSettingsForm.controls.employeeFieldMapping.disable();
        } else {
          this.exportSettingsForm.controls.reimbursableExpensePaymentType.setValue(null);
        }

        if (isreimbursableExportTypeSelected === IntacctReimbursableExpensesObject.BILL) {
          this.exportSettingsForm.controls.employeeFieldMapping.patchValue(FyleField.VENDOR);
          this.exportSettingsForm.controls.employeeFieldMapping.disable();
        }
      });
    }

    private createReimbursableExpenseWatcher(): void {
      this.exportSettingsForm.controls.reimbursableExpense.valueChanges.subscribe((isReimbursableExpenseSelected) => {
        if (isReimbursableExpenseSelected) {
          this.exportSettingsForm.controls.reimbursableExportType.setValidators(Validators.required);
          this.exportSettingsForm.controls.reimbursableExportGroup.setValidators(Validators.required);
          this.exportSettingsForm.controls.reimbursableExportDate.setValidators(Validators.required);
          this.exportSettingsForm.controls.reimbursableExpenseState.setValidators(Validators.required);
        } else {
          this.exportSettingsForm.controls.reimbursableExportType.clearValidators();
          this.exportSettingsForm.controls.reimbursableExportGroup.clearValidators();
          this.exportSettingsForm.controls.reimbursableExportDate.clearValidators();
          this.exportSettingsForm.controls.reimbursableExpenseState.clearValidators();
          this.exportSettingsForm.controls.reimbursableExportType.setValue(null);
        }
      });
      this.reimbursableExportTypeWatcher();
    }

    private cccExportTypeWatcher(): void {
      this.exportSettingsForm.controls.cccExportType.valueChanges.subscribe((isCCCExportTypeSelected) => {
        if (isCCCExportTypeSelected === IntacctCorporateCreditCardExpensesObject.JOURNAL_ENTRY) {
          this.exportSettingsForm.controls.creditCard.setValidators(Validators.required);
          this.exportSettingsForm.controls.employeeFieldMapping.enable();
        } else {
          this.exportSettingsForm.controls.creditCard.clearValidators();
          this.exportSettingsForm.controls.creditCard.setValue(null);
        }

        if (isCCCExportTypeSelected === IntacctCorporateCreditCardExpensesObject.BILL) {
          this.exportSettingsForm.controls.creditCardVendor.setValidators(Validators.required);
        } else {
          this.exportSettingsForm.controls.creditCardVendor.clearValidators();
          this.exportSettingsForm.controls.creditCardVendor.setValue(null);
        }

        if (isCCCExportTypeSelected === IntacctCorporateCreditCardExpensesObject.EXPENSE_REPORT) {
          this.exportSettingsForm.controls.employeeFieldMapping.setValue(EmployeeFieldMapping.EMPLOYEE);
          this.exportSettingsForm.controls.cccExpensePaymentType.setValidators(Validators.required);
        } else {
          this.exportSettingsForm.controls.cccExpensePaymentType.clearValidators();
          this.exportSettingsForm.controls.cccExpensePaymentType.setValue(null);
        }

        if (isCCCExportTypeSelected === IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION) {
          this.exportSettingsForm.controls.chargeCard.setValidators(Validators.required);
        } else {
          this.exportSettingsForm.controls.chargeCard.clearValidators();
          this.exportSettingsForm.controls.chargeCard.setValue(null);
        }
      });
    }

    private createCreditCardExpenseWatcher(): void {

      // If reimbursable expenses are not allowed
      // -> only credit card expenses are allowed
      // -> `creditCardExpense` switch is not shown (they're allowed by default)
      // -> all fields related to credit card expenses are required
      if (!this.brandingFeatureConfig.featureFlags.exportSettings.reimbursableExpenses) {
        this.exportSettingsForm.controls.cccExportType.setValidators(Validators.required);
        this.exportSettingsForm.controls.cccExportGroup.setValidators(Validators.required);
        this.exportSettingsForm.controls.cccExportDate.setValidators(Validators.required);
        this.exportSettingsForm.controls.cccExpenseState.setValidators(Validators.required);
      }

      this.exportSettingsForm.controls.creditCardExpense.valueChanges.subscribe((isCreditCardExpenseSelected) => {
        if (isCreditCardExpenseSelected) {
          this.exportSettingsForm.controls.cccExportType.setValidators(Validators.required);
          this.exportSettingsForm.controls.cccExportGroup.setValidators(Validators.required);
          this.exportSettingsForm.controls.cccExportDate.setValidators(Validators.required);
          this.exportSettingsForm.controls.cccExpenseState.setValidators(Validators.required);
        } else {
          this.exportSettingsForm.controls.cccExportType.clearValidators();
          this.exportSettingsForm.controls.cccExportGroup.clearValidators();
          this.exportSettingsForm.controls.cccExportDate.clearValidators();
          this.exportSettingsForm.controls.cccExpenseState.clearValidators();
          this.exportSettingsForm.controls.cccExportType.setValue(null);
        }
      });
      this.cccExportTypeWatcher();
    }

    private cccWatcher(): void {
      const cccExportGroup = this.exportSettingsForm.get('cccExportGroup');
      const cccExportTypeControl = this.exportSettingsForm.controls.cccExportType;

      cccExportTypeControl.valueChanges.subscribe((cccExport) => {
        if (cccExport === IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION) {
          cccExportGroup?.disable();
          cccExportGroup?.setValue(this.expenseGroupingFieldOptions[0].value);
        } else {
          cccExportGroup?.enable();
        }
      });
    }

    private exportFieldsWatcher(): void {
      if (this.exportSettings?.configurations?.reimbursable_expenses_object === IntacctReimbursableExpensesObject.JOURNAL_ENTRY || this.exportSettings?.configurations?.corporate_credit_card_expenses_object === IntacctCorporateCreditCardExpensesObject.JOURNAL_ENTRY) {
        this.exportSettingsForm.get('employeeFieldMapping')?.enable();
      } else {
        this.exportSettingsForm.get('employeeFieldMapping')?.disable();
      }

      if (this.exportSettings?.configurations?.corporate_credit_card_expenses_object === IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION) {
        this.exportSettingsForm.controls.cccExportGroup.setValue(this.expenseGroupingFieldOptions[0].value);
        this.exportSettingsForm.controls.cccExportGroup.disable();
      }
      this.createReimbursableExpenseWatcher();
      this.createCreditCardExpenseWatcher();
      this.cccWatcher();
    }

    private exportSelectionValidator(): ValidatorFn {
      return (control: AbstractControl): {[key: string]: object} | null => {
        let forbidden = true;
        if (this.exportSettingsForm ) {
          if (typeof control.value === 'boolean') {
            if (control.value) {
              forbidden = false;
            } else {
              if (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value) {
                forbidden = false;
              }
            }
          } else if ((control.value === ExpenseState.PAID || control.value === ExpenseState.PAYMENT_PROCESSING) && (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value)) {
            forbidden = false;
          }
          if (!forbidden) {
            control.parent?.get('reimbursableExpense')?.setErrors(null);
            control.parent?.get('creditCardExpense')?.setErrors(null);
            return null;
          }
        }
        return {
          forbiddenOption: {
            value: control.value
          }
        };
      };
    }

    private initializeExportSettingsFormWithData(): void {
      const configurations = this.exportSettings?.configurations;
      const generalMappings = this.exportSettings?.general_mappings;
      const findObjectById = (array: IntacctDestinationAttribute[], id: string | null) => array?.find(item => item.destination_id === id) || null;

      this.exportSettingsForm = this.formBuilder.group({
        reimbursableExpense: [Boolean(configurations?.reimbursable_expenses_object) || null, this.exportSelectionValidator()],
        reimbursableExportType: [configurations?.reimbursable_expenses_object || null],
        reimbursableExpensePaymentType: [findObjectById(this.destinationOptions.EXPENSE_PAYMENT_TYPE, generalMappings?.default_reimbursable_expense_payment_type.id)],
        reimbursableExportGroup: [this.exportSettingsService.getExportGroup(this.exportSettings?.expense_group_settings.reimbursable_expense_group_fields) || null],
        reimbursableExportDate: [this.exportSettings?.expense_group_settings.reimbursable_export_date_type || null],
        reimbursableExpenseState: [this.exportSettings?.expense_group_settings.expense_state || null],
        employeeFieldMapping: [configurations?.employee_field_mapping || null, Validators.required],
        autoMapEmployees: [configurations?.auto_map_employees || null],
        glAccount: [findObjectById(this.destinationOptions.ACCOUNT, generalMappings?.default_gl_account.id)],
        creditCardExpense: [Boolean(configurations?.corporate_credit_card_expenses_object), this.exportSelectionValidator()],
        cccExportType: [configurations?.corporate_credit_card_expenses_object || null],
        cccExportGroup: [this.exportSettingsService.getExportGroup(this.exportSettings?.expense_group_settings.corporate_credit_card_expense_group_fields)],
        cccExportDate: [this.exportSettings?.expense_group_settings.ccc_export_date_type || null],
        cccExpenseState: [this.exportSettings?.expense_group_settings.ccc_expense_state || null],
        cccExpensePaymentType: [findObjectById(this.destinationOptions.CCC_EXPENSE_PAYMENT_TYPE, generalMappings?.default_ccc_expense_payment_type.id)],
        creditCardVendor: [findObjectById(this.destinationOptions.VENDOR, generalMappings?.default_ccc_vendor.id)],
        creditCard: [findObjectById(this.destinationOptions.ACCOUNT, generalMappings?.default_credit_card.id)],
        chargeCard: [findObjectById(this.destinationOptions.CHARGE_CARD, generalMappings?.default_charge_card.id)],
        useMerchantInJournalLine: [brandingFeatureConfig.featureFlags.exportSettings.useMerchantInJournalLine ? (configurations?.use_merchant_in_journal_line ? configurations?.use_merchant_in_journal_line: false) : true],
        searchOption: [''],
        splitExpenseGrouping: new FormControl(this.exportSettings?.expense_group_settings?.split_expense_grouping)
      });

      if (!brandingFeatureConfig.featureFlags.exportSettings.isReimbursableExpensesAllowed) {
        this.exportSettingsForm.controls.creditCardExpense.patchValue(true);
        this.exportSettingsForm.controls.employeeFieldMapping.patchValue(FyleField.VENDOR);
      }

      this.exportFieldsWatcher();
      this.optionSearchWatcher();
      this.setupCustomWatchers();
    }

  private addMissingOption(key: IntacctExportSettingDestinationOptionKey, defaultDestinationAttribute: DefaultDestinationAttribute): void {
    const optionArray = this.destinationOptions[key];
    const option = optionArray.find(attribute => attribute.destination_id === defaultDestinationAttribute?.id);

    if (!option && defaultDestinationAttribute?.id && defaultDestinationAttribute?.name) {
      const newOption = {
        destination_id: defaultDestinationAttribute.id,
        value: defaultDestinationAttribute.name
      } as IntacctDestinationAttribute;
      optionArray.push(newOption);
      this.sortDropdownOptions(key);
    }
  }

  private addMissingOptions(): void {
    // Since pagination call doesn't return all results for options, we're making use of the export settings API to fill in options
    this.addMissingOption(IntacctExportSettingDestinationOptionKey.ACCOUNT, this.exportSettings.general_mappings?.default_gl_account);
    this.addMissingOption(IntacctExportSettingDestinationOptionKey.ACCOUNT, this.exportSettings.general_mappings?.default_credit_card);
    this.addMissingOption(IntacctExportSettingDestinationOptionKey.EXPENSE_PAYMENT_TYPE, this.exportSettings.general_mappings?.default_reimbursable_expense_payment_type);
    this.addMissingOption(IntacctExportSettingDestinationOptionKey.CCC_EXPENSE_PAYMENT_TYPE, this.exportSettings.general_mappings?.default_ccc_expense_payment_type);
    this.addMissingOption(IntacctExportSettingDestinationOptionKey.VENDOR, this.exportSettings.general_mappings?.default_ccc_vendor);
    this.addMissingOption(IntacctExportSettingDestinationOptionKey.CHARGE_CARD, this.exportSettings.general_mappings?.default_charge_card);
  }

  constructPayloadAndSave(data: ConfigurationWarningOut): void {
    this.isConfirmationDialogVisible = false;

    if (data.hasAccepted) {
      this.saveInProgress = true;
        const exportSettingPayload = SiExportSettingsService.constructPayload(this.exportSettingsForm);
        this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((response: ExportSettingGet) => {
          this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('intacctExportSettings.exportSettingsSuccess'));
          this.trackingService.trackTimeSpent(TrackingApp.INTACCT, Page.EXPORT_SETTING_INTACCT, this.sessionStartTime);
          if (this.workspaceService.getIntacctOnboardingState() === IntacctOnboardingState.EXPORT_SETTINGS) {
            this.trackingService.integrationsOnboardingCompletion(TrackingApp.INTACCT, IntacctOnboardingState.EXPORT_SETTINGS, 2, exportSettingPayload);
          } else {
            this.trackingService.intacctUpdateEvent(
              IntacctUpdateEvent.IMPORT_SETTINGS_INTACCT,
              {
                phase: this.getPhase(),
                oldState: this.exportSettings,
                newState: response
              }
            );
          }
          this.saveInProgress = false;
          if (this.isOnboarding) {
            this.workspaceService.setIntacctOnboardingState(IntacctOnboardingState.IMPORT_SETTINGS);
            this.router.navigate([`/integrations/intacct/onboarding/import_settings`]);
          } else if (this.isAdvancedSettingAffected()) {
            this.router.navigate(['/integrations/intacct/main/configuration/advanced_settings']);
          }
        }, () => {
          this.saveInProgress = false;
          this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('intacctExportSettings.exportSettingsError'));
        });
    }
  }

  private setupCustomWatchers(): void {
    this.exportSettingsForm.controls.reimbursableExportGroup?.valueChanges.subscribe((reimbursableExportGroup) => {
      this.reimbursableExpenseGroupingDateOptions = this.exportSettingsService.constructExportDateOptions(false, reimbursableExportGroup, this.exportSettingsForm.controls.reimbursableExportDate.value);

      this.exportSettingsService.clearInvalidDateOption(
        this.exportSettingsForm.get('reimbursableExportDate'),
        this.reimbursableExpenseGroupingDateOptions
      );
    });

    this.exportSettingsForm.controls.cccExportGroup?.valueChanges.subscribe((cccExportGroup) => {
      const isCoreCCCModule = this.exportSettingsForm?.value.cccExportType === IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION;
      this.cccExpenseGroupingDateOptions = this.exportSettingsService.constructExportDateOptions(
        isCoreCCCModule, cccExportGroup, this.exportSettingsForm.controls.cccExportDate.value
      );

      this.exportSettingsService.clearInvalidDateOption(
        this.exportSettingsForm.get('cccExportDate'),
        this.cccExpenseGroupingDateOptions
      );
    });
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.exportSettingService.getExportSettings().subscribe((exportSettings) => {
      this.exportSettings = exportSettings;

      this.addMissingOptions();

      this.setUpExpenseStates();
      this.initializeExportSettingsFormWithData();
      this.isLoading = false;
    });
  }


    private getPhase(): ProgressPhase {
      return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
    }

    save(): void {
      if (this.isAdvancedSettingAffected() && this.exportSettings.configurations) {
        this.warningDialogText = this.constructWarningMessage();
        this.isConfirmationDialogVisible = true;
        return;
      }
      this.constructPayloadAndSave({hasAccepted: true, event: ConfigurationWarningEvent.INTACCT_EXPORT_SETTINGS});
    }

  private sortDropdownOptions(destinationOptionKey: IntacctExportSettingDestinationOptionKey): void {
    this.destinationOptions[destinationOptionKey].sort((a: IntacctDestinationAttribute, b: IntacctDestinationAttribute) => {
      return a.value.localeCompare(b.value);
    });
  }

  private optionSearchWatcher(): void {
    this.optionSearchUpdate.pipe(
      debounceTime(1000)
    ).subscribe((event: IntacctExportSettingOptionSearch) => {
      const existingOptions = this.destinationOptions[event.destinationOptionKey].concat();
      const newOptions: IntacctDestinationAttribute[] = [];

      this.mappingService.getPaginatedDestinationAttributes(existingOptions[0].attribute_type, event.searchTerm).subscribe((response) => {
        response.results.forEach((option) => {
          // Handle special case for expense payment type (reimburse and ccc)
          if (event.destinationOptionKey === IntacctExportSettingDestinationOptionKey.EXPENSE_PAYMENT_TYPE) {
            if (option.detail.is_reimbursable) {
              newOptions.push(option);
            }
          } else if (event.destinationOptionKey === IntacctExportSettingDestinationOptionKey.CCC_EXPENSE_PAYMENT_TYPE) {
            if (!option.detail.is_reimbursable) {
              newOptions.push(option);
            }
          } else {
            newOptions.push(option);
          }
        });

        // Insert new options to existing options
        newOptions.forEach((option: IntacctDestinationAttribute) => {
          if (!existingOptions.find((existingOption) => existingOption.id === option.id)) {
            existingOptions.push(option);
          }
        });

        this.destinationOptions[event.destinationOptionKey] = existingOptions.concat();
        this.sortDropdownOptions(event.destinationOptionKey);
        this.isOptionSearchInProgress = false;
      });
    });
  }

  searchOptionsDropdown(_event: ExportSettingOptionSearch): void {
    const event = _event as IntacctExportSettingOptionSearch;
    if (event.searchTerm) {
      this.isOptionSearchInProgress = true;
      this.optionSearchUpdate.next(event);
    }
  }


  private setupPage(): void {
    const destinationAttributes = ['ACCOUNT', 'EXPENSE_PAYMENT_TYPE', 'VENDOR', 'CHARGE_CARD_NUMBER'];
    const groupedAttributes$: Observable<PaginatedintacctDestinationAttribute>[]= [];

    destinationAttributes.forEach((destinationAttribute) => {
      groupedAttributes$.push(this.mappingService.getPaginatedDestinationAttributes(destinationAttribute).pipe(filter(response => !!response)));
    });

    forkJoin(groupedAttributes$).subscribe((response) => {
      this.destinationOptions.ACCOUNT = response[0].results;
      this.destinationOptions.EXPENSE_PAYMENT_TYPE = response[1].results.filter((attr: IntacctDestinationAttribute) => attr.detail.is_reimbursable);
      this.destinationOptions.CCC_EXPENSE_PAYMENT_TYPE = response[1].results.filter((attr: IntacctDestinationAttribute) => !attr.detail.is_reimbursable);
      this.destinationOptions.VENDOR = response[2].results;
      this.destinationOptions.CHARGE_CARD = response[3].results;
      this.isMultiLineOption = brandingConfig.brandId !== 'co' ? true : false;
      this.getSettingsAndSetupForm();

    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
