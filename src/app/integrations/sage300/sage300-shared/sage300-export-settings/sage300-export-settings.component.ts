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

  reimbursableEmployeeOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getReimbursableEmployeeOptions();

  reimbursableExpenseState: Sage300ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseState();

  cccExpenseState: Sage300ExportSettingFormOption[] = this.exportSettingService.getCCCExpenseState();

  mapEmployeeOptionsOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getMapEmployeeOptionsOptions();

  constructor(
    private exportSettingService: Sage300ExportSettingService,
    private router: Router,
    private helper: HelperService
  ) { }

  private createReimbursableExpenseWatcher(): void {
    this.exportSettingForm.controls.reimbursableExpense.valueChanges.subscribe((isReimbursableExpenseSelected) => {
      if (isReimbursableExpenseSelected) {
        this.helper.markControllerAsRequired(this.exportSettingForm, 'reimbursableExportType');
        this.helper.markControllerAsRequired(this.exportSettingForm, 'reimbursableExportGroup');
        this.helper.markControllerAsRequired(this.exportSettingForm, 'reimbursableExportDate');
        this.helper.markControllerAsRequired(this.exportSettingForm, 'reimbursableExpenseState');
        this.helper.markControllerAsRequired(this.exportSettingForm, 'reimbursableEmployeeType');
      } else {
        this.helper.clearValidatorAndResetValue(this.exportSettingForm, 'reimbursableExportType');
        this.helper.clearValidatorAndResetValue(this.exportSettingForm, 'reimbursableExportGroup');
        this.helper.clearValidatorAndResetValue(this.exportSettingForm, 'reimbursableExportDate');
        this.helper.clearValidatorAndResetValue(this.exportSettingForm, 'reimbursableExpenseState');
        this.helper.clearValidatorAndResetValue(this.exportSettingForm, 'reimbursableEmployeeType');
      }
    });
  }

  private createCreditCardExpenseWatcher(): void {
    this.exportSettingForm.controls.creditCardExpense.valueChanges.subscribe((isCreditCardExpenseSelected) => {
      if (isCreditCardExpenseSelected) {
        this.helper.markControllerAsRequired(this.exportSettingForm, 'cccExportType');
        this.helper.markControllerAsRequired(this.exportSettingForm, 'cccExportGroup');
        this.helper.markControllerAsRequired(this.exportSettingForm, 'cccExportDate');
        this.helper.markControllerAsRequired(this.exportSettingForm, 'cccExpenseState');
      } else {
        this.helper.clearValidatorAndResetValue(this.exportSettingForm, 'cccExportType');
        this.helper.clearValidatorAndResetValue(this.exportSettingForm, 'cccExportGroup');
        this.helper.clearValidatorAndResetValue(this.exportSettingForm, 'cccExportDate');
        this.helper.clearValidatorAndResetValue(this.exportSettingForm, 'cccExpenseState');
      }
    });
  }

  setCustomValidatorsAndWatchers() {
    // Toggles
    this.createReimbursableExpenseWatcher();
    this.createCreditCardExpenseWatcher();
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.exportSettingService.getSage300ExportSettings().subscribe((exportSettingsResponse: Sage300ExportSettingGet) => {
      this.exportSettings = exportSettingsResponse;
      this.exportSettingForm = ExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings);
      this.setCustomValidatorsAndWatchers();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
