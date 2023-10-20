import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppName, AutoMapEmployeeOptions, CCCExpenseState, ConfigurationCta, ExpenseGroupedBy, ExpenseState, ExportDateType, FyleField, Sage300ExpenseDate, Sage300ExportTypes } from 'src/app/core/models/enum/enum.model';
import { Sage300ExportSettingFormOption, sage300ExportSettingGet } from 'src/app/core/models/sage300/sage300-configuration/sage300-export-setting.model';
import { Sage300ExportSettingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-export-setting.service';
import { Sage300HelperService } from 'src/app/core/services/sage300/sage300-helper/sage300-helper.service';

@Component({
  selector: 'app-sage300-export-settings',
  templateUrl: './sage300-export-settings.component.html',
  styleUrls: ['./sage300-export-settings.component.scss']
})
export class Sage300ExportSettingsComponent implements OnInit {

  isLoading: boolean = false;

  isOnboarding: boolean;

  exportSettings: any;

  exportSettingForm: FormGroup;

  redirectLink: string = '';

  appName: string = AppName.SAGE300;

  saveInProgress: boolean;

  ConfigurationCtaText = ConfigurationCta;

  expenseGroupByOptions: Sage300ExportSettingFormOption[] = [
    {
      label: 'Expense',
      value: ExpenseGroupedBy.EXPENSE
    },
    {
      label: 'Expense Report',
      value: ExpenseGroupedBy.REPORT
    }
  ];

  expenseGroupingDateOptions: Sage300ExportSettingFormOption[] = [
    {
      label: 'Current Date',
      value: Sage300ExpenseDate.CURRENT_DATE
    },
    {
      label: 'Approved Date',
      value: Sage300ExpenseDate.APPROVED_AT
    },
    {
      label: 'Last Spent Date',
      value: Sage300ExpenseDate.LAST_SPENT_AT
    }
  ];

  expensesExportTypes: Sage300ExportSettingFormOption[] = [
    {
      label: 'Accounts Payable Invoice',
      value: Sage300ExportTypes.PURCHASE_INVOICE
    },
    {
      label: 'Direct Cost',
      value: Sage300ExportTypes.DIRECT_COST
    }
  ];

  reimbursableEmployeeOptions: Sage300ExportSettingFormOption[] = [
    {
      label: 'Employee',
      value: FyleField.EMPLOYEE
    },
    {
      label: 'Vendor',
      value: FyleField.VENDOR
    }
  ];

  reimbursableExpenseState: Sage300ExportSettingFormOption[] = [
    {
      label: 'Payment Processing',
      value: ExpenseState.PAYMENT_PROCESSING
    },
    {
      label: 'Paid',
      value: ExpenseState.PAID
    }
  ];

  cccExpenseState: Sage300ExportSettingFormOption[] = [
    {
      label: 'Approved',
      value: CCCExpenseState.APPROVED
    },
    {
      label: 'Closed',
      value: CCCExpenseState.PAID
    }
  ];

  autoMapEmployeeOptionsOptions: Sage300ExportSettingFormOption[] = [
    {
      value: null,
      label: 'None'
    },
    {
      value: AutoMapEmployeeOptions.NAME,
      label: 'Match Names on Fyle and Sage 300 CRE'
    },
    {
      value: AutoMapEmployeeOptions.EMAIL,
      label: 'Match E-mails on Fyle and Sage 300 CRE'
    },
    {
      value: AutoMapEmployeeOptions.EMPLOYEE_CODE,
      label: 'Match Fyle Employee Code to Sage Name'
    }
  ];

  constructor(
    private exportSettingService: Sage300ExportSettingService,
    private router: Router,
    private formBuilder: FormBuilder,
    private helperService: Sage300HelperService
  ) { }

  getFieldMapping(exportType: ExpenseGroupedBy): string {
    return exportType[0].toUpperCase() + exportType.substr(1).toLowerCase();
  }

  private exportSelectionValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: object} | null => {
      let forbidden = true;
      if (this.exportSettingForm ) {
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

  private createReimbursableExpenseWatcher(): void {
    this.exportSettingForm.controls.reimbursableExpense.valueChanges.subscribe((isReimbursableExpenseSelected) => {
      if (isReimbursableExpenseSelected) {
        this.exportSettingForm.controls.reimbursableExportType.setValidators(Validators.required);
        this.exportSettingForm.controls.reimbursableExportGroup.setValidators(Validators.required);
        this.exportSettingForm.controls.reimbursableExportDate.setValidators(Validators.required);
        this.exportSettingForm.controls.reimbursableExpenseState.setValidators(Validators.required);
        this.exportSettingForm.controls.reimbursableEmployeeType.setValidators(Validators.required);
      } else {
        this.exportSettingForm.controls.reimbursableExportType.clearValidators();
        this.exportSettingForm.controls.reimbursableExportGroup.clearValidators();
        this.exportSettingForm.controls.reimbursableExportDate.clearValidators();
        this.exportSettingForm.controls.reimbursableExpenseState.clearValidators();
        this.exportSettingForm.controls.reimbursableEmployeeType.clearValidators();
        this.exportSettingForm.controls.reimbursableExpenseState.setValue(null);
        this.exportSettingForm.controls.reimbursableExportType.setValue(null);
        this.exportSettingForm.controls.reimbursableExportGroup.setValue(null);
        this.exportSettingForm.controls.reimbursableExportDate.setValue(null);
        this.exportSettingForm.controls.reimbursableEmployeeType.setValue(null);
      }
    });
  }

  private createCreditCardExpenseWatcher(): void {
    this.exportSettingForm.controls.creditCardExpense.valueChanges.subscribe((isCreditCardExpenseSelected) => {
      if (isCreditCardExpenseSelected) {
        this.exportSettingForm.controls.cccExportType.setValidators(Validators.required);
        this.exportSettingForm.controls.cccExportGroup.setValidators(Validators.required);
        this.exportSettingForm.controls.cccExportDate.setValidators(Validators.required);
        this.exportSettingForm.controls.cccExpenseState.setValidators(Validators.required);
      } else {
        this.exportSettingForm.controls.cccExportType.clearValidators();
        this.exportSettingForm.controls.cccExportGroup.clearValidators();
        this.exportSettingForm.controls.cccExportDate.clearValidators();
        this.exportSettingForm.controls.cccExpenseState.clearValidators();
        this.exportSettingForm.controls.cccExportType.setValue(null);
        this.exportSettingForm.controls.cccExpenseState.setValue(null);
        this.exportSettingForm.controls.cccExportGroup.setValue(null);
        this.exportSettingForm.controls.cccExportDate.setValue(null);
      }
    });
  }

  setCustomValidatorsAndWatchers() {
      // Toggles
      this.createReimbursableExpenseWatcher();
      this.createCreditCardExpenseWatcher();

  }

  private setupForm(): void {
    this.isLoading = false;
    this.isOnboarding = this.router.url.includes('onboarding');
    // This.exportSettingService.getSage300ExportSettings().subscribe((exportSettingsResponse: sage300ExportSettingGet) => {
      // This.exportSettings = exportSettingsResponse;
      this.exportSettings = {
        "reimbursable_expenses_export_type": "PURCHASE_INVOICE",
        "reimbursable_expense_state": "PAYMENT_PROCESSING",
        "reimbursable_expense_date": "LAST_SPENT_AT",
        "reimbursable_expense_grouped_by": "EXPENSE",
        "credit_card_expense_export_type": "PURCHASE_INVOICE",
        "credit_card_expense_state": "CLOSED",
        "credit_card_expense_grouped_by": "EXPENSE",
        "credit_card_expense_date": "APPROVED_AT",
        "default_ccc_account_name": "credit card account",
        "default_ccc_account_id": "12312",
        "default_vendor_name": "Nilesh",
        "default_vendor_id": "123"
      };
      this.exportSettingForm = this.formBuilder.group({
        reimbursableExpense: [this.exportSettings?.reimbursable_expenses_export_type ? true : false, this.exportSelectionValidator()],
        reimbursableExportType: [this.exportSettings?.reimbursable_expenses_export_type ? this.exportSettings.reimbursable_expenses_export_type : null],
        reimbursableExpenseState: [this.exportSettings?.reimbursable_expense_state ? this.exportSettings?.reimbursable_expense_state : null],
        reimbursableExportDate: [this.exportSettings?.reimbursable_expense_date ? this.exportSettings?.reimbursable_expense_date : null],
        reimbursableExportGroup: [this.exportSettings?.reimbursable_expense_grouped_by ? this.exportSettings?.reimbursable_expense_grouped_by: null],
        reimbursableEmployeeType: [null],
        reimbursableEmployeeMappingType: [null],
        creditCardExpense: [this.exportSettings?.credit_card_expense_export_type ? true : false, this.exportSelectionValidator()],
        cccExportType: [this.exportSettings?.credit_card_expense_export_type ? this.exportSettings.credit_card_expense_export_type : null],
        cccExpenseState: [this.exportSettings?.credit_card_expense_state ? this.exportSettings?.credit_card_expense_state : null],
        cccExportDate: [this.exportSettings?.credit_card_expense_date ? this.exportSettings?.credit_card_expense_date : null],
        cccExportGroup: [this.exportSettings?.credit_card_expense_grouped_by ? this.exportSettings?.credit_card_expense_grouped_by: null],
        defaultCCCAccountName: [this.exportSettings?.default_ccc_account_name ? this.exportSettings?.default_ccc_account_name : null],
        defaultCCCAccountId: [this.exportSettings?.default_ccc_account_id ? this.exportSettings?.default_ccc_account_id : null],
        defaultVendorName: [this.exportSettings?.default_vendor_name ? this.exportSettings?.default_vendor_name : null],
        defaultVendorId: [this.exportSettings?.default_vendor_id ? this.exportSettings?.default_vendor_id : null]
      });
      this.setCustomValidatorsAndWatchers();
      this.isLoading = false;
    // });
  }

  save() {
    // Will be added here soon
  }

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
  }

  ngOnInit(): void {
    this.setupForm();
  }

}
