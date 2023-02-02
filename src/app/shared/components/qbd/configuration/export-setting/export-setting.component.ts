import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { QBDCorporateCreditCardExpensesObject, QBDConfigurationCtaText, QBDExpenseGroupedBy, QBDExpenseState, QBDExportDateType, QBDReimbursableExpensesObject, QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { ExportSettingModel, QBDExportSettingFormOption, QBDExportSettingGet } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';
import { QbdExportSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-setting.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';

@Component({
  selector: 'app-export-setting',
  templateUrl: './export-setting.component.html',
  styleUrls: ['./export-setting.component.scss'],
  providers: [MessageService]
})
export class ExportSettingComponent implements OnInit {

  isLoading: boolean = true;

  saveInProgress: boolean = false;

  isOnboarding: boolean = true;

  exportSettingsForm: FormGroup;

  ConfigurationCtaText = QBDConfigurationCtaText;

  QBDReimbursableExpensesObject= QBDReimbursableExpensesObject;

  expenseStateOptions: QBDExportSettingFormOption[] = [
    {
      value: QBDExpenseState.PAYMENT_PROCESSING,
      label: 'Payment Processing'
    },
    {
      value: QBDExpenseState.PAID,
      label: 'Paid'
    },
    {
      value: QBDExpenseState.APPROVED,
      label: 'Approved'
    }
  ];

  expenseGroupingFieldOptions: QBDExportSettingFormOption[] = [
    {
      label: 'Report',
      value: QBDExpenseGroupedBy.REPORT
    },
    {
      label: 'Expense',
      value: QBDExpenseGroupedBy.EXPENSE
    }
  ];

  reimbursableExpenseGroupingDateOptions: QBDExportSettingFormOption[] = [
    {
      label: 'Spend Date',
      value: QBDExportDateType.SPENT_AT
    },
    {
      label: 'Date of export',
      value: QBDExportDateType.LAST_SPENT_AT
    }
  ];

  creditCardExportTypes: QBDExportSettingFormOption[] = [
    {
      label: 'Credit Card Purchase',
      value: QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
    },
    {
      label: 'Journal Entry',
      value: QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY
    }
  ];

  reimbursableExportTypes: QBDExportSettingFormOption[] = [
    {
      label: 'Bill',
      value: QBDReimbursableExpensesObject.BILL
    },
    {
      label: 'Journal Entry',
      value: QBDReimbursableExpensesObject.JOURNAL_ENTRY
    }
  ];

  exportSettings: QBDExportSettingGet;

  constructor(
    private router: Router,
    private exportSettingService: QbdExportSettingService,
    private formBuilder: FormBuilder,
    private workspaceService: QbdWorkspaceService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) { }

  private createReimbursableExpenseWatcher(): void {
    this.exportSettingsForm.controls.reimbursableExpense.valueChanges.subscribe((isReimbursableExpenseSelected) => {
      if (isReimbursableExpenseSelected) {
        this.exportSettingsForm.controls.reimbursableExportType.setValidators(Validators.required);
        this.exportSettingsForm.controls.reimbursableExportGroup.setValidators(Validators.required);
        this.exportSettingsForm.controls.reimbursableExportDate.setValidators(Validators.required);
      } else {
        this.exportSettingsForm.controls.reimbursableExportType.clearValidators();
        this.exportSettingsForm.controls.reimbursableExportGroup.clearValidators();
        this.exportSettingsForm.controls.reimbursableExportDate.clearValidators();
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
        this.exportSettingsForm.controls.cccExportDate.setValidators(Validators.required);
      } else {
        this.exportSettingsForm.controls.cccExportType.clearValidators();
        this.exportSettingsForm.controls.cccExportGroup.clearValidators();
        this.exportSettingsForm.controls.cccExportDate.clearValidators();
        this.exportSettingsForm.controls.cccExportType.setValue(null);
        this.exportSettingsForm.controls.cccExportGroup.setValue(null);
        this.exportSettingsForm.controls.cccExportDate.setValue(null);
      }
    });
  }

  private setCustomValidatorsAndWatchers(): void {
    // Toggles
    this.createReimbursableExpenseWatcher();
    this.createCreditCardExpenseWatcher();
  }

  private exportSelectionValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: object} | null => {
      let forbidden = true;
      if (this.exportSettingsForm && this.exportSettingsForm.value.reimbursableExpenseState && this.exportSettingsForm.value.cccExpenseState) {
        if (typeof control.value === 'boolean') {
          if (control.value) {
            forbidden = false;
          } else {
            if (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value) {
              forbidden = false;
            }
          }
        } else if ((control.value === QBDExpenseState.PAID || control.value === QBDExpenseState.PAYMENT_PROCESSING) && (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value)) {
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

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.exportSettingService.getQbdExportSettings().subscribe((exportSettingResponse : QBDExportSettingGet) => {
      this.exportSettings = exportSettingResponse;
      this.exportSettingsForm = this.formBuilder.group({
        reimbursableExportType: [this.exportSettings?.reimbursable_expenses_export_type],
        reimbursableExpense: [this.exportSettings?.reimbursable_expenses_export_type ? true : false, this.exportSelectionValidator()],
        reimbursableExportGroup: [this.exportSettings?.reimbursable_expense_grouped_by ? this.exportSettings?.reimbursable_expense_grouped_by : null],
        reimbursableExportDate: [this.exportSettings?.reimbursable_expense_date ? this.exportSettings?.reimbursable_expense_date : null],
        creditCardExpense: [this.exportSettings?.credit_card_expense_export_type ? true : false, this.exportSelectionValidator()],
        cccExportType: [this.exportSettings?.credit_card_expense_export_type ? this.exportSettings?.credit_card_expense_export_type : null],
        cccExportGroup: [this.exportSettings?.credit_card_expense_grouped_by ? this.exportSettings?.credit_card_expense_grouped_by : null],
        cccExportDate: [this.exportSettings?.credit_card_expense_date ? this.exportSettings?.credit_card_expense_date : null],
        bankAccount: [this.exportSettings?.bank_account_name ? this.exportSettings?.bank_account_name : null],
        cccEntityName: [this.exportSettings?.credit_card_entity_name_preference ? this.exportSettings?.credit_card_entity_name_preference : null],
        cccAccountName: [this.exportSettings?.credit_card_account_name ? this.exportSettings?.credit_card_account_name : null],
        reimbursableExpenseState: [this.exportSettings?.reimbursable_expense_state ? this.exportSettings?.reimbursable_expense_state : null],
        cccExpenseState: [this.exportSettings?.credit_card_expense_state ? this.exportSettings?.credit_card_expense_state : null]
      });
      this.setCustomValidatorsAndWatchers();
      this.isLoading = false;
    });
  }

  private constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const exportSettingPayload = ExportSettingModel.constructPayload(this.exportSettingsForm);

    this.exportSettingService.postQbdExportSettings(exportSettingPayload).subscribe((response: QBDExportSettingGet) => {
      this.saveInProgress = false;
      this.messageService.add({key: 'tl', severity: 'success', summary: 'Success', detail: 'Export settings saved successfully'});
      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(QBDOnboardingState.FIELD_MAPPING);
        this.router.navigate([`/integrations/qbd/onboarding/field_mappings`]);
      }
    }, () => {
      this.saveInProgress = false;
      this.messageService.add({key: 'tl', severity: 'error', summary: 'Error', detail: 'Error saving export settings, please try again later'});
      });
  }


  save(): void {
    this.constructPayloadAndSave();
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
