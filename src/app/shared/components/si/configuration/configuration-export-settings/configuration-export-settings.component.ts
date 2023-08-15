import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { CCCExpenseState, ConfigurationCta, CorporateCreditCardExpensesObject, FyleField, ExpenseGroupedBy, ExpenseState, ExportDateType, RedirectLink, IntacctReimbursableExpensesObject, ExpenseGroupingFieldOption } from 'src/app/core/models/enum/enum.model';
import { ExportSettingFormOption, ExportSettingGet } from 'src/app/core/models/si/si-configuration/export-settings.model';
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

  isLoading: boolean;

  exportSettingsForm: FormGroup;

  RedirectLink = RedirectLink;

  isOnboarding: boolean;

  saveInProgress: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  IntacctReimbursableExpensesObject= IntacctReimbursableExpensesObject;

  expenseStateOptions: ExportSettingFormOption[];

  cccExpenseStateOptions: ExportSettingFormOption[];

  is_simplify_report_closure_enabled: boolean = false;

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

    getEmployeeType(employeeType: string): string {
      const lowerCaseWord = employeeType.toLowerCase();

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

    private setCCExpenseDateOptions(cccExportType: CorporateCreditCardExpensesObject, cccExportGroup: string) : void {
      if (cccExportType === CorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION){
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
      } else if (cccExportType === CorporateCreditCardExpensesObject.JOURNAL_ENTRY && cccExportGroup === ExpenseGroupedBy.EXPENSE) {
        this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat([{
          label: 'Card Transaction Post date',
          value: ExportDateType.POSTED_AT
        }]);
      } else {
        this.cccExpenseGroupingDateOptions = [this.reimbursableExpenseGroupingDateOptions[1]];
      }
    }

    private createReimbursableExpenseWatcher(): void {
      this.exportSettingsForm.controls.reimbursableExpense.valueChanges.subscribe((isReimbursableExpenseSelected) => {
        if (isReimbursableExpenseSelected) {
          this.exportSettingsForm.controls.reimbursableExportType.setValidators(Validators.required);
          this.exportSettingsForm.controls.reimbursableExportGroup.setValidators(Validators.required);
          this.exportSettingsForm.controls.reimbursableExportDate.setValidators(Validators.required);
          this.exportSettingsForm.controls.reimbursableExpenseState.setValidators(Validators.required);
          this.exportSettingsForm.controls.bankAccount.setValidators(Validators.required);
        } else {
          this.exportSettingsForm.controls.reimbursableExportType.clearValidators();
          this.exportSettingsForm.controls.reimbursableExportGroup.clearValidators();
          this.exportSettingsForm.controls.reimbursableExportDate.clearValidators();
          this.exportSettingsForm.controls.reimbursableExpenseState.clearValidators();
          this.exportSettingsForm.controls.bankAccount.clearValidators();
          this.exportSettingsForm.controls.bankAccount.setValue(null);
          this.exportSettingsForm.controls.reimbursableExpenseState.setValue(null);
          this.exportSettingsForm.controls.reimbursableExportType.setValue(null);
          this.exportSettingsForm.controls.reimbursableExportGroup.setValue(null);
          this.exportSettingsForm.controls.reimbursableExportDate.setValue(null);
        }
      });
    }

    private createCreditCardExpenseWatcher(): void {
      this.exportSettingsForm.controls.creditCardExpense.valueChanges.subscribe((isCreditCardExpenseSelected) => {
        if (isCreditCardExpenseSelected) {
          this.exportSettingsForm.controls.cccExportType.setValidators(Validators.required);
          this.exportSettingsForm.controls.cccExportGroup.setValidators(Validators.required);
          this.exportSettingsForm.controls.cccExportGroup.patchValue(this.exportSettings?.credit_card_expense_grouped_by ? this.exportSettings?.credit_card_expense_grouped_by : this.expenseGroupingFieldOptions[1].value);
          this.exportSettingsForm.controls.cccExportDate.setValidators(Validators.required);
          this.exportSettingsForm.controls.cccExportDate.patchValue(this.exportSettings?.credit_card_expense_date ? this.exportSettings?.credit_card_expense_date : this.cccExpenseGroupingDateOptions[0].value);
          this.exportSettingsForm.controls.cccEntityName.setValidators(Validators.required);
          this.exportSettingsForm.controls.cccExpenseState.setValidators(Validators.required);
          this.exportSettingsForm.controls.cccAccountName.setValidators(Validators.required);
        } else {
          this.exportSettingsForm.controls.cccExportType.clearValidators();
          this.exportSettingsForm.controls.cccExportGroup.clearValidators();
          this.exportSettingsForm.controls.cccExportDate.clearValidators();
          this.exportSettingsForm.controls.cccEntityName.clearValidators();
          this.exportSettingsForm.controls.cccExpenseState.clearValidators();
          this.exportSettingsForm.controls.cccAccountName.clearValidators();
          this.exportSettingsForm.controls.cccExportType.setValue(null);
          this.exportSettingsForm.controls.cccExpenseState.setValue(null);
          this.exportSettingsForm.controls.cccAccountName.setValue(null);
          this.exportSettingsForm.controls.cccExportGroup.setValue(null);
          this.exportSettingsForm.controls.cccExportDate.setValue(null);
          this.exportSettingsForm.controls.cccEntityName.setValue(null);
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
          employeeFieldMappingControl?.setValue('Employee');
        } else if (reimbursableExport === 'BILL') {
          employeeFieldMappingControl?.setValue('Vendor');
        }
    
        if (reimbursableExport === 'JOURNAL_ENTRY') {
          employeeFieldMappingControl?.enable();
        }
      });
    }
    

    private exportFieldsWatcher(): void {
      this.createReimbursableExpenseWatcher();
      this.createCreditCardExpenseWatcher();
      this.employeeFieldWatcher();
    }

    private setupDynamicOptions(): void {
      this.mappingService.getSageIntacctAccounts().subscribe(glAccounts => {
        this.sageIntacctDefaultGLAccounts = glAccounts;
      });
      this.mappingService.getSageIntacctExpensePaymentType().subscribe(expensePaymentType => {
        this.sageIntacctExpensePaymentType = expensePaymentType.filter(expensePaymentType => expensePaymentType.detail.is_reimbursable);
        this.sageIntacctCCCExpensePaymentType = expensePaymentType.filter(expensePaymentType => expensePaymentType.detail.is_reimbursable === false);

        console.log(expensePaymentType.filter(expensePaymentType => expensePaymentType.detail.is_reimbursable === false));
      });
      // VENDOR
      this.mappingService.getSageIntacctVendors().subscribe(vendors => {
        this.sageIntacctDefaultVendor = vendors;
      });
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
      if (this.exportSettings?.credit_card_expense_export_type) {
        const creditCardExpenseExportGroup = this.exportSettings?.credit_card_expense_grouped_by ? this.exportSettings?.credit_card_expense_grouped_by : ExpenseGroupedBy.EXPENSE;
        this.setCreditCardExpenseGroupingDateOptions(this.exportSettings?.credit_card_expense_export_type);
      } else {
        this.setCreditCardExpenseGroupingDateOptions(CorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION);
      }
    }

    private getSettingsAndSetupForm(): void {
      this.isLoading = true;
      this.isOnboarding = this.router.url.includes('onboarding');
      this.exportSettingService.getExportSettings().subscribe((exportSettingResponse : ExportSettingGet) => {
        console.log(exportSettingResponse);
        this.exportSettings = exportSettingResponse;
        this.is_simplify_report_closure_enabled = this.exportSettings?.is_simplify_report_closure_enabled;
        this.setUpExpenseStates();
        this.setupCCCExpenseGroupingDateOptions();
        this.setupDynamicOptions();
        this.exportSettingsForm = this.formBuilder.group({
          reimbursableExportType: [this.exportSettings?.reimbursable_expenses_export_type],
          reimbursableExpense: [this.exportSettings?.reimbursable_expenses_export_type ? true : false],
          reimbursableExportGroup: [this.getExportGroup(this.exportSettings?.reimbursable_expense_grouped_by)],
          reimbursableExportDate: [this.exportSettings?.reimbursable_expense_date ? this.exportSettings?.reimbursable_expense_date : null],
          employeeFieldMapping: [this.exportSettings?.employeeFieldMapping ? this.exportSettings?.employeeFieldMapping : null],
          autoMapEmployees: [this.exportSettings?.auto_map_employees ? this.exportSettings?.auto_map_employees : null],
          creditCardExpense: [this.exportSettings?.credit_card_expense_export_type ? true : false],
          cccExportType: [this.exportSettings?.credit_card_expense_export_type ? this.exportSettings?.credit_card_expense_export_type : null],
          cccExportGroup: [this.getExportGroup(this.exportSettings?.credit_card_expense_grouped_by)],
          cccExportDate: [this.exportSettings?.credit_card_expense_date ? this.exportSettings?.credit_card_expense_date : this.cccExpenseGroupingDateOptions[0].value],
          bankAccount: [this.exportSettings?.bank_account_name ? this.exportSettings?.bank_account_name : null],
          cccEntityName: [this.exportSettings?.credit_card_entity_name_preference ? this.exportSettings?.credit_card_entity_name_preference : null],
          cccAccountName: [this.exportSettings?.credit_card_account_name ? this.exportSettings?.credit_card_account_name : null],
          reimbursableExpenseState: [this.exportSettings?.expense_state ? this.exportSettings?.expense_state : null],
          cccExpenseState: [this.exportSettings?.ccc_expense_state ? this.exportSettings?.ccc_expense_state : null],
          glAccount: [this.exportSettings?.gl_accounts ? this.exportSettings?.gl_accounts : null],
          defaultReimbursableExpensePaymentType: [null],
          defaultCCCExpensePaymentType: [null],
        });
        this.exportFieldsWatcher();
        this.isLoading = false;
      }, () => {
          this.setUpExpenseStates();
          this.setupCCCExpenseGroupingDateOptions();
          this.setupDynamicOptions();
          this.exportSettingsForm = this.formBuilder.group({
            reimbursableExportType: [null],
            reimbursableExpense: [false],
            reimbursableExportGroup: [null],
            reimbursableExportDate: [null],
            employeeFieldMapping: [null],
            autoMapEmployees: [null],
            creditCardExpense: [false],
            cccExportType: [null],
            cccExportGroup: [null],
            cccExportDate: [null],
            bankAccount: [null],
            cccEntityName: [null],
            cccAccountName: [null],
            reimbursableExpenseState: [null],
            cccExpenseState: [null],
            glAccount: [null],
            reimbursableExpensePaymentType: [null],
            cccExpensePaymentType: [null],
          });
          this.exportFieldsWatcher();
          this.isLoading = false;
        }
      );
    }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
