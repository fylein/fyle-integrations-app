import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppName, ConfigurationCta, ExpenseGroupedBy, Sage300ExportType, Sage300Link } from 'src/app/core/models/enum/enum.model';
import { Sage300DestinationAttributes } from 'src/app/core/models/sage300/db/sage300-destination-attribuite.model';
import { ExportSettingModel, Sage300ExportSettingFormOption, Sage300ExportSettingGet, ValidatorRule } from 'src/app/core/models/sage300/sage300-configuration/sage300-export-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { Sage300ExportSettingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-export-setting.service';
import { Sage300HelperService } from 'src/app/core/services/sage300/sage300-helper/sage300-helper.service';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
  selector: 'app-sage300-export-settings',
  templateUrl: './sage300-export-settings.component.html',
  styleUrls: ['./sage300-export-settings.component.scss']
})
export class Sage300ExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  isOnboarding: boolean;

  isSaveInProgress: boolean;

  exportSettings: Sage300ExportSettingGet | any;

  exportSettingForm: FormGroup;

  redirectLink: string = Sage300Link.EXPORT_SETTING;

  appName: string = AppName.SAGE300;

  Sage300ExportType = Sage300ExportType;

  ConfigurationCtaText = ConfigurationCta;

  expenseGroupByOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpenseGroupByOptions();

  expenseGroupingDateOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpenseGroupingDateOptions();

  expensesExportTypeOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpensesExportTypeOptions();

  reimbursableExpenseState: Sage300ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseState();

  cccExpenseState: Sage300ExportSettingFormOption[] = this.exportSettingService.getCCCExpenseState();

  validatorRule: ValidatorRule = {
    'reimbursableExpense': ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'reimbursableExpenseState'],
    'creditCardExpense': ['cccExportType', 'cccExportGroup', 'cccExportDate', 'cccExpenseState']
  };

  defaultVendor: Sage300DestinationAttributes[] | any;

  defaultCreditCardAccounts: Sage300DestinationAttributes[] | any;

  constructor(
    private exportSettingService: Sage300ExportSettingService,
    private router: Router,
    private helper: HelperService,
    private helperService: Sage300HelperService
  ) { }

  getExportType(exportType: string | null): string {
    return exportType ? new SnakeCaseToSpaceCasePipe().transform(new TitleCasePipe().transform(exportType)): 'expense';
  }

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
  }

  save() {
    // Will be added here soon
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    // ForkJoin([
    //   This.exportSettingService.getSage300ExportSettings(),
    //   This.exportSettingService.getDestinationAttributes('VENDOR'),
    //   This.exportSettingService.getDestinationAttributes('ACCOUNT')
    // ]).subscribe((response) => {
      this.exportSettings = {
        "reimbursable_expenses_export_type": "PURCHASE_INVOICE",
        "reimbursable_expense_state": "PAYMENT_PROCESSING",
        "reimbursable_expense_date": "last_spend_at",
        "reimbursable_expense_grouped_by": "EXPENSE",
        "credit_card_expense_export_type": "PURCHASE_INVOICE",
        "credit_card_expense_state": "CLOSED",
        "credit_card_expense_grouped_by": "EXPENSE",
        "credit_card_expense_date": "approved_at",
        "default_ccc_credit_card_account_name": "CCC credit card account",
        "default_ccc_credit_card_account_id": "123",
        "default_reimbursable_credit_card_account_name": "reimbursable credit card account",
        "default_reimbursable_credit_card_account_id": "342",
        "default_vendor_name": "Nilesh",
        "default_vendor_id": "123",
        "auto_map_employees": true
      };
      this.exportSettings.credit_card_expense_grouped_by = ['expense_id'];
      this.exportSettings.reimbursable_expense_grouped_by = ['expense_id'];
      this.exportSettingForm = ExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings);
      this.exportSettingForm.controls.reimbursableExpense.setValidators(this.helper.exportSelectionValidator(this.exportSettingForm));
      this.helper.setCustomValidatorsAndWatchers(this.validatorRule, this.exportSettingForm);
      this.defaultVendor = [
        {
          "id": 214726,
          "attribute_type": "CHARGE_CARD_NUMBER",
          "display_name": "Charge Card Account",
          "value": "1234",
          "destination_id": "1234",
          "auto_created": false,
          "active": null,
          "detail": null,
          "created_at": "2023-10-06T05:55:38.466413Z",
          "updated_at": "2023-10-06T05:55:38.466417Z",
          "workspace": 313
        },
        {
          "id": 214731,
          "attribute_type": "VENDOR",
          "display_name": "vendor",
          "value": "A-1 Electric Company",
          "destination_id": "V100",
          "auto_created": false,
          "active": true,
          "detail": {
            "email": null
          },
          "created_at": "2023-10-06T05:55:42.487234Z",
          "updated_at": "2023-10-06T05:55:42.487238Z",
          "workspace": 313
        }
      ];
      this.defaultCreditCardAccounts = [
        {
          "id": 214726,
          "attribute_type": "CHARGE_CARD_NUMBER",
          "display_name": "Charge Card Account",
          "value": "1234",
          "destination_id": "1234",
          "auto_created": false,
          "active": null,
          "detail": null,
          "created_at": "2023-10-06T05:55:38.466413Z",
          "updated_at": "2023-10-06T05:55:38.466417Z",
          "workspace": 313
        },
        {
          "id": 214731,
          "attribute_type": "VENDOR",
          "display_name": "vendor",
          "value": "A-1 Electric Company",
          "destination_id": "V100",
          "auto_created": false,
          "active": true,
          "detail": {
            "email": null
          },
          "created_at": "2023-10-06T05:55:42.487234Z",
          "updated_at": "2023-10-06T05:55:42.487238Z",
          "workspace": 313
        }
      ];
      this.isLoading = false;
    // }, (error) => {
    //   This.exportSettingForm = ExportSettingModel.mapAPIResponseToFormGroup();
    //   This.isLoading = false;
    // });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
