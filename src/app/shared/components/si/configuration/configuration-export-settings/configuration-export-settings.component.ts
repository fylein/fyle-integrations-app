import { Component, OnInit } from '@angular/core';
import { AbstractControl, Form, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { CCCExpenseState, ConfigurationCta, CorporateCreditCardExpensesObject, FyleField, ExpenseGroupedBy, ExpenseState, ExportDateType, RedirectLink, IntacctReimbursableExpensesObject, ExpenseGroupingFieldOption, Page, ToastSeverity, IntacctOnboardingState, UpdateEvent, ProgressPhase, IntacctUpdateEvent } from 'src/app/core/models/enum/enum.model';
import { ExportSettingFormOption, ExportSettingGet, ExportSettingModel } from 'src/app/core/models/si/si-configuration/export-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiExportSettingService } from 'src/app/core/services/si/si-configuration/si-export-setting.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-configuration-export-settings',
  templateUrl: './configuration-export-settings.component.html',
  styleUrls: ['./configuration-export-settings.component.scss']
})
export class ConfigurationExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  exportSettingsForm: FormGroup;

  RedirectLink = RedirectLink;

  isOnboarding: boolean;

  saveInProgress: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  IntacctReimbursableExpensesObject = IntacctReimbursableExpensesObject;

  CorporateCreditCardExpensesObject = CorporateCreditCardExpensesObject;

  expenseStateOptions: ExportSettingFormOption[];

  cccExpenseStateOptions: ExportSettingFormOption[];

  is_simplify_report_closure_enabled: boolean = true;

  exportSettings: ExportSettingGet;

  customMessage: string;

  sageIntacctDefaultGLAccounts: DestinationAttribute[];

  sageIntacctExpensePaymentType: DestinationAttribute[];

  sageIntacctCCCExpensePaymentType: DestinationAttribute[];

  sageIntacctDefaultVendor: DestinationAttribute[];

  sageIntacctDefaultChargeCard: DestinationAttribute[];

  sageIntacctDefaultCreditCard: DestinationAttribute[];

  sageIntacctDefaultItem: DestinationAttribute[];

  sageIntacctPaymentAccounts: DestinationAttribute[];

  private sessionStartTime = new Date();

  expenseGroupingFieldOptions: ExportSettingFormOption[] = [
    {
      label: 'Expense Report',
      value: ExpenseGroupedBy.REPORT
    },
    {
      label: 'Expense',
      value: ExpenseGroupedBy.EXPENSE
    },
    {
      label: 'Payment',
      value: ExpenseGroupedBy.PAYMENT
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

  creditCardExportTypes: ExportSettingFormOption[] = [
    {
      label: 'Bill',
      value: IntacctReimbursableExpensesObject.BILL
    },
    {
      label: 'Expense Report',
      value: IntacctReimbursableExpensesObject.EXPENSE_REPORT
    },
    {
      label: 'Journal Entry',
      value: CorporateCreditCardExpensesObject.JOURNAL_ENTRY
    },
    {
      label: 'Charge Card Transaction',
      value: CorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION
    }
  ];

  autoMapEmployeeOptions: ExportSettingFormOption[] = [
    { label: 'Match emails on Fyle and Sage Intacct', value: 'EMAIL' },
    { label: 'Match names on Fyle and Sage Intacct', value: 'NAME' },
    { label: 'Match Fyle Employee Code to Sage Intacct Name', value: 'EMPLOYEE_CODE' }
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

  glAccount: boolean = false;

  constructor(
    private router: Router,
    private exportSettingService: SiExportSettingService,
    private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: SiWorkspaceService,
    private mappingService: SiMappingsService
    ) { }

    private getExportGroup(exportGroups: string[] | null): string {
      if (exportGroups) {
        const exportGroup = exportGroups.find((exportGroup) => {
          return exportGroup === ExpenseGroupingFieldOption.EXPENSE_ID || exportGroup === ExpenseGroupingFieldOption.CLAIM_NUMBER || exportGroup === ExpenseGroupingFieldOption.SETTLEMENT_ID;
        });
        return exportGroup ? exportGroup : ExpenseGroupingFieldOption.CLAIM_NUMBER;
      }
      return '';
    }

    getExportType(exportType: IntacctReimbursableExpensesObject | CorporateCreditCardExpensesObject): string {
      const lowerCaseWord = exportType.toLowerCase();

      return lowerCaseWord.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
    }

    private setUpExpenseStates(): void {
      this.cccExpenseStateOptions = [
        {
          label: this.is_simplify_report_closure_enabled ? 'Approved' : 'Payment Processing',
          value: this.is_simplify_report_closure_enabled ? CCCExpenseState.APPROVED: CCCExpenseState.PAYMENT_PROCESSING
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

    private reimbursableExportWatcher(): void {
      this.exportSettingsForm.controls.reimbursableExportType.valueChanges.subscribe((isreimbursableExportTypeSelected) => {
        if (isreimbursableExportTypeSelected === 'JOURNAL_ENTRY') {
          this.exportSettingsForm.controls.glAccount.setValidators(Validators.required);
        } else {
          this.exportSettingsForm.controls.glAccount.setValue(null);
          this.exportSettingsForm.controls.glAccount.clearValidators();
        }

        if (isreimbursableExportTypeSelected === 'EXPENSE_REPORT') {
          this.exportSettingsForm.controls.reimbursableExpensePaymentType.setValidators(Validators.required);
        } else {
          this.exportSettingsForm.controls.reimbursableExpensePaymentType.setValue(null);
          this.exportSettingsForm.controls.reimbursableExpensePaymentType.clearValidators();
        }

        if (!isreimbursableExportTypeSelected) {
          this.exportSettingsForm.controls.employeeFieldMapping.setValue(null);
          this.exportSettingsForm.controls.employeeFieldMapping.clearValidators();
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
          this.reimbursableExportWatcher();
        } else {
          this.exportSettingsForm.controls.reimbursableExportType.clearValidators();
          this.exportSettingsForm.controls.reimbursableExportGroup.clearValidators();
          this.exportSettingsForm.controls.reimbursableExportDate.clearValidators();
          this.exportSettingsForm.controls.reimbursableExpenseState.clearValidators();
          this.exportSettingsForm.controls.reimbursableExpenseState.setValue(null);
          this.exportSettingsForm.controls.reimbursableExportType.setValue(null);
          this.exportSettingsForm.controls.reimbursableExportGroup.setValue(null);
          this.exportSettingsForm.controls.reimbursableExportDate.setValue(null);
        }
      });
    }

    private cccExportTypeWatcher(): void {
      this.exportSettingsForm.controls.cccExportType.valueChanges.subscribe((isCCCExportTypeSelected) => {
        if (isCCCExportTypeSelected === 'JOURNAL_ENTRY') {
          this.exportSettingsForm.controls.creditCard.setValidators(Validators.required);
        } else {
          this.exportSettingsForm.controls.creditCard.clearValidators();
          this.exportSettingsForm.controls.creditCard.setValue(null);
        }

        if (isCCCExportTypeSelected === 'BILL') {
          this.exportSettingsForm.controls.creditCardVendor.setValidators(Validators.required);
        } else {
          this.exportSettingsForm.controls.creditCardVendor.clearValidators();
          this.exportSettingsForm.controls.creditCardVendor.setValue(null);
        }

        if (isCCCExportTypeSelected === 'EXPENSE_REPORT') {
          this.exportSettingsForm.controls.cccExpensePaymentType.setValidators(Validators.required);
        } else {
          this.exportSettingsForm.controls.cccExpensePaymentType.clearValidators();
          this.exportSettingsForm.controls.cccExpensePaymentType.setValue(null);
        }

        if (isCCCExportTypeSelected === 'CHARGE_CARD_TRANSACTION') {
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
          this.cccExportTypeWatcher();
        } else {
          this.exportSettingsForm.controls.cccExportType.clearValidators();
          this.exportSettingsForm.controls.cccExportGroup.clearValidators();
          this.exportSettingsForm.controls.cccExportDate.clearValidators();
          this.exportSettingsForm.controls.cccExpenseState.clearValidators();
          this.exportSettingsForm.controls.cccExportType.setValue(null);
          this.exportSettingsForm.controls.cccExpenseState.setValue(null);
          this.exportSettingsForm.controls.cccExportGroup.setValue(null);
          this.exportSettingsForm.controls.cccExportDate.setValue(null);
        }
      });
    }

    private employeeFieldWatcher(): void {
      const employeeFieldMappingControl = this.exportSettingsForm.get('employeeFieldMapping');
      const reimbursableExportControl = this.exportSettingsForm.controls.reimbursableExportType;

      reimbursableExportControl.valueChanges.subscribe((reimbursableExport) => {
        if (reimbursableExport === 'EXPENSE_REPORT' || reimbursableExport === 'BILL') {
          employeeFieldMappingControl?.disable();
        }

        if (reimbursableExport === 'EXPENSE_REPORT') {
          employeeFieldMappingControl?.setValue('EMPLOYEE');
        } else if (reimbursableExport === 'BILL') {
          employeeFieldMappingControl?.setValue('VENDOR');
        }

        if (reimbursableExport === 'JOURNAL_ENTRY') {
          employeeFieldMappingControl?.enable();
        }
      });
    }

    private cccWatcher(): void {
      const cccExportDate = this.exportSettingsForm.get('cccExportDate');
      const cccExportGroup = this.exportSettingsForm.get('cccExportGroup');
      const cccExportTypeControl = this.exportSettingsForm.controls.cccExportType;
      const cccEntityControl = this.exportSettingsForm.get('cccEntityName');

      cccExportTypeControl.valueChanges.subscribe((cccExport) => {
        if (cccExport === 'CHARGE_CARD_TRANSACTION') {
          cccExportDate?.disable();
          cccExportGroup?.disable();
          cccExportDate?.setValue('Spend Date');
          cccExportGroup?.setValue('Expense');
        } else {
          cccExportDate?.enable();
          cccExportGroup?.enable();
        }
        if (cccExport === 'EXPENSE_REPORT' || cccExport === 'BILL') {
          cccEntityControl?.disable();
        }
        if (cccExport === 'EXPENSE_REPORT') {
          cccEntityControl?.setValue('EMPLOYEE');
        } else if (cccExport === 'BILL'||cccExport === 'CHARGE_CARD_TRANSACTION') {
          cccEntityControl?.setValue('VENDOR');
        }
        if (cccExport === 'JOURNAL_ENTRY') {
          cccEntityControl?.enable();
        }
      });
    }


    private exportFieldsWatcher(): void {
      this.createReimbursableExpenseWatcher();
      this.createCreditCardExpenseWatcher();
      this.employeeFieldWatcher();
      this.cccWatcher();
    }

    setCreditCardExpenseGroupingDateOptions(creditCardExportGroup: string): void {
      if (creditCardExportGroup === ExpenseGroupingFieldOption.EXPENSE_ID) {
        this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat([{
          label: 'Card Transaction Post date',
          value: ExportDateType.POSTED_AT
        }]);
      } else {
        this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();
      }
    }

    private setupCCCExpenseGroupingDateOptions(): void {
      if (this.exportSettings?.configurations?.corporate_credit_card_expenses_object) {
        const creditCardExpenseExportGroup = this.exportSettings?.expense_group_settings?.corporate_credit_card_expense_group_fields ? this.exportSettings?.expense_group_settings.corporate_credit_card_expense_group_fields : ExpenseGroupedBy.EXPENSE;
        this.setCreditCardExpenseGroupingDateOptions(this.exportSettings?.configurations?.corporate_credit_card_expenses_object);
      } else {
        this.setCreditCardExpenseGroupingDateOptions(CorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION);
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

    setCCCExportDate(): string | FormControl | null {
      if (this.exportSettings) {
        if (this.exportSettings?.configurations.corporate_credit_card_expenses_object === 'CHARGE_CARD_TRANSACTION') {
          return 'Spend Date';
        } else {
          return this.exportSettings?.expense_group_settings.ccc_export_date_type;
        }
      }
      return null;
    }

    private initializeExportSettingsFormWithDefaults(): void {
      this.exportSettingsForm = this.formBuilder.group({
          reimbursableExportType: [null],
          reimbursableExpense: [null, this.exportSelectionValidator()],
          reimbursableExportGroup: [null],
          reimbursableExportDate: [null],
          employeeFieldMapping: [null],
          autoMapEmployees: [null],
          reimbursableExpenseState: [null],
          glAccount: [null],
          reimbursableExpensePaymentType: [null],
          creditCardExpense: [null, this.exportSelectionValidator()],
          cccExportType: [null],
          cccExportGroup: [null],
          cccExportDate: [null],
          cccEntityName: [null],
          cccExpenseState: [null],
          cccExpensePaymentType: [null],
          chargeCard: [null],
          creditCard: [null],
          creditCardVendor: [null]
      });
      this.exportFieldsWatcher();
  }

  private initializeExportSettingsFormWithData(): void {
      this.exportSettingsForm = this.formBuilder.group({
        reimbursableExpense: [!!this.exportSettings?.configurations.reimbursable_expenses_object, this.exportSelectionValidator()],
        reimbursableExportType: [this.exportSettings?.configurations.reimbursable_expenses_object],
        reimbursableExpensePaymentType: [(this.sageIntacctExpensePaymentType?.find(paymentType => paymentType.id.toString() === this.exportSettings?.general_mappings.default_reimbursable_expense_payment_type.id)) || null],
        reimbursableExportGroup: [this.getExportGroup(this.exportSettings?.expense_group_settings.reimbursable_expense_group_fields)],
        reimbursableExportDate: [this.exportSettings?.expense_group_settings.reimbursable_export_date_type || null],
        reimbursableExpenseState: [this.exportSettings?.expense_group_settings.expense_state || null],
        employeeFieldMapping: [this.exportSettings?.configurations.employee_field_mapping || null],
        autoMapEmployees: [this.exportSettings?.configurations.auto_map_employees || null],
        glAccount: [(this.sageIntacctDefaultGLAccounts?.find(glAccount => glAccount.id.toString() === this.exportSettings?.general_mappings.default_gl_account.id)) || null],
        creditCardExpense: [!!this.exportSettings?.configurations.corporate_credit_card_expenses_object, this.exportSelectionValidator()],
        cccExportType: [this.exportSettings?.configurations.corporate_credit_card_expenses_object || null],
        cccExportGroup: [this.getExportGroup(this.exportSettings?.expense_group_settings.corporate_credit_card_expense_group_fields)],
        cccExportDate: [this.setCCCExportDate()],
        cccExpenseState: [this.exportSettings?.expense_group_settings.ccc_expense_state || null],
        cccExpensePaymentType: [(this.sageIntacctCCCExpensePaymentType?.find(cccExpensePaymentType => cccExpensePaymentType.id.toString() === this.exportSettings?.general_mappings.default_ccc_expense_payment_type.id)) || null],
        creditCardVendor: [(this.sageIntacctDefaultVendor?.find(creditCardVendor => creditCardVendor.id.toString() === this.exportSettings?.general_mappings.default_ccc_vendor.id)) || null],
        creditCard: [(this.sageIntacctDefaultCreditCard?.find(creditCard => creditCard.id.toString() === this.exportSettings?.general_mappings.default_credit_card.id)) || null],
        chargeCard: [(this.sageIntacctDefaultChargeCard?.find(chargeCard => chargeCard.id.toString() === this.exportSettings?.general_mappings.default_charge_card.id)) || null],
        cccEntityName: [!(!!this.exportSettings?.configurations.reimbursable_expenses_object) ? this.exportSettings?.configurations.employee_field_mapping : null]
      });
      if(this.exportSettings?.configurations.reimbursable_expenses_object==='BILL' || this.exportSettings?.configurations.reimbursable_expenses_object==='EXPENSE_REPORT') {
        this.exportSettingsForm.get('employeeFieldMapping')?.disable();
      }
      if (this.exportSettings?.configurations.corporate_credit_card_expenses_object === 'CHARGE_CARD_TRANSACTION') {
        this.exportSettingsForm.controls.cccExportDate.disable();
        this.exportSettingsForm.controls.cccExportGroup.setValue('Expense');
        this.exportSettingsForm.controls.cccExportGroup.disable();
      }
      this.exportFieldsWatcher();
  }

  private getSettingsAndSetupForm(): void {
    const destinationAttributes = ['ACCOUNT', 'EXPENSE_PAYMENT_TYPE', 'VENDOR', 'CHARGE_CARD_NUMBER'];
  
    const groupedAttributes$ = this.mappingService.getGroupedDestinationAttributes(destinationAttributes);
    const exportSettings$ = this.exportSettingService.getExportSettings();
  
    forkJoin({
      groupedAttributes: groupedAttributes$,
      exportSettings: exportSettings$
    }).subscribe(
      ({ groupedAttributes, exportSettings }) => {
        this.sageIntacctDefaultGLAccounts = groupedAttributes.ACCOUNT;
        this.sageIntacctExpensePaymentType = groupedAttributes.EXPENSE_PAYMENT_TYPE.filter(attr => attr.detail.is_reimbursable);
        this.sageIntacctCCCExpensePaymentType = groupedAttributes.EXPENSE_PAYMENT_TYPE.filter(attr => !attr.detail.is_reimbursable);
        this.sageIntacctDefaultVendor = groupedAttributes.VENDOR;
        this.sageIntacctDefaultChargeCard = groupedAttributes.CHARGE_CARD_NUMBER;
  
        this.exportSettings = exportSettings;
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
      const exportSettingPayload = ExportSettingModel.constructPayload(this.exportSettingsForm);
      this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((response: ExportSettingGet) => {
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export settings saved successfully');
        this.trackingService.trackTimeSpent(Page.EXPORT_SETTING_INTACCT, this.sessionStartTime);
        if (this.workspaceService.getIntacctOnboardingState() === IntacctOnboardingState.EXPORT_SETTINGS) {
          this.trackingService.integrationsOnboardingCompletion(IntacctOnboardingState.EXPORT_SETTINGS, 2, exportSettingPayload);
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

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }
}
