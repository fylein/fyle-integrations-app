import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject, debounceTime, filter, forkJoin } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ExportSettingModel } from 'src/app/core/models/common/export-settings.model';
import { DefaultDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { CCCExpenseState, ConfigurationCta, IntacctCorporateCreditCardExpensesObject, FyleField, ExpenseGroupedBy, ExpenseState, ExportDateType, IntacctReimbursableExpensesObject, ExpenseGroupingFieldOption, Page, ToastSeverity, IntacctOnboardingState, ProgressPhase, IntacctUpdateEvent, AppName, IntacctExportSettingDestinationOptionKey, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { ExportSettingDestinationAttributeOption, IntacctDestinationAttribute, PaginatedintacctDestinationAttribute } from 'src/app/core/models/intacct/db/destination-attribute.model';
import { ExportSettingFormOption, ExportSettingGet, ExportSettingModel as IntacctExportSettingModel, ExportSettingOptionSearch } from 'src/app/core/models/intacct/intacct-configuration/export-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiExportSettingService } from 'src/app/core/services/si/si-configuration/si-export-setting.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

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

  ConfigurationCtaText = ConfigurationCta;

  IntacctReimbursableExpensesObject = IntacctReimbursableExpensesObject;

  IntacctCorporateCreditCardExpensesObject = IntacctCorporateCreditCardExpensesObject;

  expenseStateOptions: ExportSettingFormOption[];

  cccExpenseStateOptions: ExportSettingFormOption[];

  is_simplify_report_closure_enabled: boolean = true;

  exportSettings: ExportSettingGet;

  customMessage: string;

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

  expenseGroupingFieldOptions: ExportSettingFormOption[] = [
    {
      label: 'Expense',
      value: ExpenseGroupingFieldOption.EXPENSE_ID
    },
    {
      label: 'Report',
      value: ExpenseGroupingFieldOption.CLAIM_NUMBER
    }
  ];

  reimbursableExpenseGroupingDateOptions: ExportSettingFormOption[] = [
    {
      label: 'Spend Date',
      value: ExportDateType.SPENT_AT
    },
    {
      label: 'Current Date',
      value: ExportDateType.CURRENT_DATE
    },
    {
      label: 'Verification Date',
      value: ExportDateType.VERIFIED_DATE
    },
    {
      label: 'Approval Date',
      value: ExportDateType.APPROVAL_DATE
    },
    {
      label: 'Last Spend Date',
      value: ExportDateType.LAST_SPENT_AT
    }
  ];

  cccExpenseGroupingDateOptions: ExportSettingFormOption[];

  creditCardExportTypes: ExportSettingFormOption[] = ExportSettingModel.constructCCCOptions(brandingConfig.brandId);

  autoMapEmployeeOptions: ExportSettingFormOption[] = [
    { label: 'Based on Employee E-mail ID', value: 'EMAIL' },
    { label: 'Based on Employee Name', value: 'NAME' },
    { label: 'Based on Employee Code', value: 'EMPLOYEE_CODE' }
  ];

  reimbursableExportTypes: ExportSettingFormOption[] = [
    {
      label: 'Expense Report',
      value: IntacctReimbursableExpensesObject.EXPENSE_REPORT
    },
    {
      label: 'Bill',
      value: IntacctReimbursableExpensesObject.BILL
    },
    {
      label: 'Journal Entry',
      value: IntacctReimbursableExpensesObject.JOURNAL_ENTRY
    }
  ];

  employeeFieldOptions: ExportSettingFormOption[] = [
    {
      label: 'Employee',
      value: FyleField.EMPLOYEE
    },
    {
      label: 'Vendor',
      value: FyleField.VENDOR
    }
  ];

  private optionSearchUpdate = new Subject<ExportSettingOptionSearch>();

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingConfig = brandingConfig;

  constructor(
    private router: Router,
    private exportSettingService: SiExportSettingService,
    private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: SiWorkspaceService,
    private mappingService: SiMappingsService,
    private sanitizer: DomSanitizer
    ) { }

    refreshDimensions(isRefresh: boolean) {
      this.mappingService.refreshSageIntacctDimensions().subscribe();
      this.mappingService.refreshFyleDimensions().subscribe();
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Refreshing data dimensions from Sage Intacct');
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

      return new TitleCasePipe().transform(employeeFieldMappingLabel);
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
          label: 'Approved',
          value: CCCExpenseState.APPROVED
        },
        {
          label: this.is_simplify_report_closure_enabled ? 'Closed' : 'Paid',
          value: CCCExpenseState.PAID
        }
      ];

      this.expenseStateOptions = [
        {
          label: this.is_simplify_report_closure_enabled ? 'Processing' : 'Payment Processing',
          value: ExpenseState.PAYMENT_PROCESSING
        },
        {
          label: this.is_simplify_report_closure_enabled ? 'Closed' : 'Paid',
          value: ExpenseState.PAID
        }
      ];
    }

    private setCCExpenseDateOptions(cccExportType: IntacctCorporateCreditCardExpensesObject) : void {
    if (cccExportType === IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION) {
      this.cccExpenseGroupingDateOptions = [
        {
          label: 'Card Transaction Post date',
          value: ExportDateType.POSTED_AT
        },
        {
          label: 'Spend Date',
          value: ExportDateType.SPENT_AT
        }
      ];
      this.exportSettingsForm?.controls.cccExportDate.patchValue(ExportDateType.SPENT_AT);
    } else {
      this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions;
    }
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
        this.setCCExpenseDateOptions(isCCCExportTypeSelected);
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
          cccExportGroup?.setValue('Expense');
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
        this.exportSettingsForm.controls.cccExportGroup.setValue('Expense');
        this.exportSettingsForm.controls.cccExportGroup.disable();
      }
      this.createReimbursableExpenseWatcher();
      this.createCreditCardExpenseWatcher();
      this.cccWatcher();
    }

    private setupCCCExpenseGroupingDateOptions(): void {
      if (this.exportSettings?.configurations?.corporate_credit_card_expenses_object) {
        const creditCardExpenseExportGroup = this.exportSettings?.expense_group_settings?.corporate_credit_card_expense_group_fields ? this.exportSettings?.expense_group_settings.corporate_credit_card_expense_group_fields : ExpenseGroupedBy.EXPENSE;
        this.setCCExpenseDateOptions(this.exportSettings?.configurations?.corporate_credit_card_expenses_object);
      } else {
        this.setCCExpenseDateOptions(IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION);
      }
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
        reimbursableExportGroup: [ExportSettingModel.getExportGroup(this.exportSettings?.expense_group_settings.reimbursable_expense_group_fields) || null],
        reimbursableExportDate: [this.exportSettings?.expense_group_settings.reimbursable_export_date_type || null],
        reimbursableExpenseState: [this.exportSettings?.expense_group_settings.expense_state || null],
        employeeFieldMapping: [configurations?.employee_field_mapping || null, Validators.required],
        autoMapEmployees: [configurations?.auto_map_employees || null],
        glAccount: [findObjectById(this.destinationOptions.ACCOUNT, generalMappings?.default_gl_account.id)],
        creditCardExpense: [Boolean(configurations?.corporate_credit_card_expenses_object), this.exportSelectionValidator()],
        cccExportType: [configurations?.corporate_credit_card_expenses_object || null],
        cccExportGroup: [ExportSettingModel.getExportGroup(this.exportSettings?.expense_group_settings.corporate_credit_card_expense_group_fields)],
        cccExportDate: [this.exportSettings?.expense_group_settings.ccc_export_date_type || null],
        cccExpenseState: [this.exportSettings?.expense_group_settings.ccc_expense_state || null],
        cccExpensePaymentType: [findObjectById(this.destinationOptions.CCC_EXPENSE_PAYMENT_TYPE, generalMappings?.default_ccc_expense_payment_type.id)],
        creditCardVendor: [findObjectById(this.destinationOptions.VENDOR, generalMappings?.default_ccc_vendor.id)],
        creditCard: [findObjectById(this.destinationOptions.ACCOUNT, generalMappings?.default_credit_card.id)],
        chargeCard: [findObjectById(this.destinationOptions.CHARGE_CARD, generalMappings?.default_charge_card.id)],
        useMerchantInJournalLine: [configurations?.use_merchant_in_journal_line ? configurations?.use_merchant_in_journal_line: false]
      });

      this.exportFieldsWatcher();
      this.optionSearchWatcher();
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
    this.addMissingOption(IntacctExportSettingDestinationOptionKey.CHARGE_CARD, this.exportSettings.general_mappings?.default_credit_card);
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.exportSettingService.getExportSettings().subscribe((exportSettings) => {
      this.exportSettings = exportSettings;

      this.addMissingOptions();

      this.setUpExpenseStates();
      this.setupCCCExpenseGroupingDateOptions();
      this.initializeExportSettingsFormWithData();
      this.isLoading = false;
    });
  }


    private getPhase(): ProgressPhase {
      return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
    }

    save(): void {
      this.saveInProgress = true;
      const exportSettingPayload = IntacctExportSettingModel.constructPayload(this.exportSettingsForm);
      this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((response: ExportSettingGet) => {
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export settings saved successfully');
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
        }
      }, () => {
        this.saveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
        });
    }

  private sortDropdownOptions(destinationOptionKey: IntacctExportSettingDestinationOptionKey): void {
    this.destinationOptions[destinationOptionKey].sort((a: IntacctDestinationAttribute, b: IntacctDestinationAttribute) => {
      return a.value.localeCompare(b.value);
    });
  }

  private optionSearchWatcher(): void {
    this.optionSearchUpdate.pipe(
      debounceTime(1000)
    ).subscribe((event: ExportSettingOptionSearch) => {
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

  searchOptionsDropdown(event: ExportSettingOptionSearch): void {
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

      this.getSettingsAndSetupForm();
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
