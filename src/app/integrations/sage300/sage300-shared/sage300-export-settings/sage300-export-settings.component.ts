import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ExportSettingModel, Sage300ExportSettingFormOption, Sage300ExportSettingGet } from 'src/app/core/models/sage300/sage300-configuration/sage300-export-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { Sage300ExportSettingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-export-setting.service';

@Component({
  selector: 'app-sage300-export-settings',
  templateUrl: './sage300-export-settings.component.html',
  styleUrls: ['./sage300-export-settings.component.scss']
})
export class Sage300ExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  isOnboarding: boolean;

  exportSettings: Sage300ExportSettingGet;

  exportSettingForm: FormGroup;

  expenseGroupByOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpenseGroupByOptions();

  expenseGroupingDateOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpenseGroupingDateOptions();

  expensesExportTypeOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpensesExportTypeOptions();

  reimbursableExpenseState: Sage300ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseState();

  cccExpenseState: Sage300ExportSettingFormOption[] = this.exportSettingService.getCCCExpenseState();

  constructor(
    private exportSettingService: Sage300ExportSettingService,
    private router: Router,
    private helper: HelperService
  ) { }

  validatorRule = {
    'reimbursableExpense': {
      formController: 'reimbursableExpense',
      true: ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'reimbursableExpenseState', 'defaultReimbursableCCCAccountName', 'defaultReimbursableCCCAccountId'],
      false: ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'reimbursableExpenseState', 'defaultReimbursableCCCAccountName', 'defaultReimbursableCCCAccountId']
    },
    'creditCardExpense': {
      formController: 'creditCardExpense',
      true: ['cccExportType', 'cccExportGroup', 'cccExportDate', 'cccExpenseState', 'defaultCreditCardCCCAccountName', 'defaultCreditCardCCCAccountId', 'defaultVendorName', 'defaultVendorId'],
      false: ['cccExportType', 'cccExportGroup', 'cccExportDate', 'cccExpenseState', 'defaultCreditCardCCCAccountName', 'defaultCreditCardCCCAccountId', 'defaultVendorName', 'defaultVendorId']
    }
  };

  private setCustomValidatorsAndWatchers() {
    const keys = Object.keys(this.validatorRule);
    Object.values(this.validatorRule).forEach((value, index) => {
      this.exportSettingForm.controls[keys[index]].valueChanges.subscribe((isSelected) => {
        if (isSelected) {
          value.true.forEach((element: string) => {
            this.helper.markControllerAsRequired(this.exportSettingForm, element);
          });
        } else {
          value.false.forEach((element: string) => {
            this.helper.clearValidatorAndResetValue(this.exportSettingForm, element);
          });
        }
      });
    });
  }

  // Private createReimbursableExpenseWatcher(): void {
  //   This.exportSettingForm.controls.reimbursableExpense.valueChanges.subscribe((isReimbursableExpenseSelected) => {
  //     If (isReimbursableExpenseSelected) {
  //       This.helper.markControllerAsRequired(this.exportSettingForm, 'reimbursableExportType');
  //       This.helper.markControllerAsRequired(this.exportSettingForm, 'reimbursableExportGroup');
  //       This.helper.markControllerAsRequired(this.exportSettingForm, 'reimbursableExportDate');
  //       This.helper.markControllerAsRequired(this.exportSettingForm, 'reimbursableExpenseState');
  //       This.helper.markControllerAsRequired(this.exportSettingForm, 'defaultReimbursableCCCAccountName');
  //       This.helper.markControllerAsRequired(this.exportSettingForm, 'defaultReimbursableCCCAccountId');
  //     } else {
  //       This.helper.clearValidatorAndResetValue(this.exportSettingForm, 'reimbursableExportType');
  //       This.helper.clearValidatorAndResetValue(this.exportSettingForm, 'reimbursableExportGroup');
  //       This.helper.clearValidatorAndResetValue(this.exportSettingForm, 'reimbursableExportDate');
  //       This.helper.clearValidatorAndResetValue(this.exportSettingForm, 'reimbursableExpenseState');
  //       This.helper.clearValidatorAndResetValue(this.exportSettingForm, 'defaultReimbursableCCCAccountName');
  //       This.helper.clearValidatorAndResetValue(this.exportSettingForm, 'defaultReimbursableCCCAccountId');
  //     }
  //   });
  // }

  // Private createCreditCardExpenseWatcher(): void {
  //   This.exportSettingForm.controls.creditCardExpense.valueChanges.subscribe((isCreditCardExpenseSelected) => {
  //     If (isCreditCardExpenseSelected) {
  //       This.helper.markControllerAsRequired(this.exportSettingForm, 'cccExportType');
  //       This.helper.markControllerAsRequired(this.exportSettingForm, 'cccExportGroup');
  //       This.helper.markControllerAsRequired(this.exportSettingForm, 'cccExportDate');
  //       This.helper.markControllerAsRequired(this.exportSettingForm, 'cccExpenseState');
  //       This.helper.markControllerAsRequired(this.exportSettingForm, 'defaultCreditCardCCCAccountName');
  //       This.helper.markControllerAsRequired(this.exportSettingForm, 'defaultCreditCardCCCAccountId');
  //       This.helper.markControllerAsRequired(this.exportSettingForm, 'defaultVendorName');
  //       This.helper.markControllerAsRequired(this.exportSettingForm, 'defaultVendorId');
  //     } else {
  //       This.helper.clearValidatorAndResetValue(this.exportSettingForm, 'cccExportType');
  //       This.helper.clearValidatorAndResetValue(this.exportSettingForm, 'cccExportGroup');
  //       This.helper.clearValidatorAndResetValue(this.exportSettingForm, 'cccExportDate');
  //       This.helper.clearValidatorAndResetValue(this.exportSettingForm, 'cccExpenseState');
  //       This.helper.clearValidatorAndResetValue(this.exportSettingForm, 'defaultCreditCardCCCAccountName');
  //       This.helper.clearValidatorAndResetValue(this.exportSettingForm, 'defaultCreditCardCCCAccountId');
  //       This.helper.clearValidatorAndResetValue(this.exportSettingForm, 'defaultVendorName');
  //       This.helper.clearValidatorAndResetValue(this.exportSettingForm, 'defaultVendorId');
  //     }
  //   });
  // }

  // SetCustomValidatorsAndWatchers() {
  //   // Toggles
  //   This.createReimbursableExpenseWatcher();
  //   This.createCreditCardExpenseWatcher();
  // }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.exportSettingService.getSage300ExportSettings().subscribe((exportSettingsResponse: Sage300ExportSettingGet) => {
      this.exportSettings = exportSettingsResponse;
      this.exportSettingForm = ExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings);
      this.setCustomValidatorsAndWatchers();
      this.isLoading = false;
    }, (error) => {
      this.exportSettingForm = ExportSettingModel.mapAPIResponseToFormGroup();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
