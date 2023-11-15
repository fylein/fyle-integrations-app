import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { ConditionField, EmailOption, ExpenseFilter, ExpenseFilterGetResponse, ExpenseFilterResponse, HourOption, SkipExportModel } from 'src/app/core/models/common/advanced-settings.model';
import { AppName, ConfigurationCta, Sage300Link } from 'src/app/core/models/enum/enum.model';
import { AdvancedSettingValidatorRule, Sage300AdvancedSettingGet, Sage300AdvancedSettingModel } from 'src/app/core/models/sage300/sage300-configuration/sage300-advanced-settings.mode';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { Sage300AdvancedSettingsService } from 'src/app/core/services/sage300/sage300-configuration/sage300-advanced-settings.service';
import { Sage300ExportSettingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-export-setting.service';
import { Sage300HelperService } from 'src/app/core/services/sage300/sage300-helper/sage300-helper.service';
import { ExpenseFilterCondition, adminEmails, expenseFiltersGet, sage300AdvancedSettingResponse } from '../fixture';

@Component({
  selector: 'app-sage300-advanced-settings',
  templateUrl: './sage300-advanced-settings.component.html',
  styleUrls: ['./sage300-advanced-settings.component.scss']
})
export class Sage300AdvancedSettingsComponent implements OnInit {

  isLoading: boolean = true;

  advancedSettingForm: FormGroup;

  skipExportForm: FormGroup;

  expenseFilters: ExpenseFilterGetResponse;

  conditionFieldOptions: ConditionField[];

  advancedSetting: Sage300AdvancedSettingGet | null;

  adminEmails: EmailOption[];

  isSaveInProgress: boolean;

  supportArticleLink: string = Sage300Link.ADVANCED_SETTING;

  isOnboarding: boolean;

  appName: string = AppName.SAGE300;

  hours: HourOption[] = [];

  isReimbursableExpense: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  defaultMemoOptions: string[] = ['employee_email', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];

  defaultTopMemoOptions: string[] = ['employee_email', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];

  memoPreviewText: string;

  memoStructure: string[] = [];

  constructor(
    private advancedSettingsService: Sage300AdvancedSettingsService,
    private helper: HelperService,
    private helperService: Sage300HelperService,
    private exportSettingsService: Sage300ExportSettingService
  ) { }

  private formatMemoPreview(): void {
    const time = Date.now();
    const today = new Date(time);

    const previewValues: { [key: string]: string } = {
      employee_email: 'john.doe@acme.com',
      category: 'Meals and Entertainment',
      purpose: 'Client Meeting',
      merchant: 'Pizza Hut',
      report_number: 'C/2021/12/R/1',
      spent_on: today.toLocaleDateString(),
      expense_link: 'https://app.fylehq.com/app/main/#/enterprise/view_expense/'
    };
    this.memoPreviewText = '';
    const memo: string[] = [];
    this.memoStructure.forEach((field, index) => {
      if (field in previewValues) {
        const defaultIndex = this.defaultMemoOptions.indexOf(this.memoStructure[index]);
        memo[defaultIndex] = previewValues[field];
      }
    });
    memo.forEach((field, index) => {
      this.memoPreviewText += field;
      if (index + 1 !== memo.length) {
        this.memoPreviewText = this.memoPreviewText + ' - ';
      }
    });
  }

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
  }

  deleteExpenseFilter(rank: number) {
    this.advancedSettingsService.deleteExpenseFilter(rank).subscribe();
  }

  skipExportWatcher(): void {
    this.advancedSettingForm.controls.skipExport.valueChanges.subscribe((isSelected) => {
      if (isSelected) {
        const fields = ['condition1', 'operator1', 'value1'];
        this.helper.handleSkipExportFormUpdates(this.skipExportForm, fields, true);
      } else {
        const fields = ['condition1', 'operator1', 'value1', 'condition2', 'operator2', 'value2', 'join_by'];
        this.helper.handleSkipExportFormUpdates(this.skipExportForm, fields, false);
      }
    });
  }

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingForm.value.memoStructure;
    this.formatMemoPreview();
    this.advancedSettingForm.controls.memoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      this.formatMemoPreview();
    });
  }


  formWatchers() {
    this.skipExportWatcher();
    this.createMemoStructureWatcher();
    const skipExportFormWatcherFields: AdvancedSettingValidatorRule = {
      condition1: ['operator1', 'value1'],
      condition2: ['operator2', 'value2'],
      operator1: ['value1'],
      operator2: ['value2']
    };
    this.helper.setConfigurationSettingValidatorsAndWatchers(skipExportFormWatcherFields, this.skipExportForm);
  }

  saveSkipExportFields(): void {
    if (!this.skipExportForm.valid) {
      return;
    }
    const valueField = this.skipExportForm.getRawValue();
    if (!valueField.condition1.field_name) {
      return;
    }
    if (valueField.condition1.field_name !== 'report_title' && valueField.operator1 === 'iexact') {
      valueField.operator1 = 'in';
    }
    if (valueField.join_by) {
      valueField.join_by = valueField.join_by.value;
      if (valueField.condition2.field_name !== 'report_title' && valueField.operator2 === 'iexact') {
        valueField.operator2 = 'in';
      }
    }
    if (valueField.condition1.is_custom === true) {
      if (valueField.operator1 === 'is_empty') {
        valueField.value1 = ['True'];
        valueField.operator1 = 'isnull';
      } else if (valueField.operator1 === 'is_not_empty') {
        valueField.value1 = ['False'];
        valueField.operator1 = 'isnull';
      }
    }

    if (valueField.condition1.field_name === 'spent_at') {
      valueField.value1 = new Date(valueField.value1).toISOString().split('T')[0] + 'T17:00:00.000Z';
    }

    if (typeof valueField.value1 === 'string') {
      valueField.value1 = [valueField.value1];
    }
    valueField.rank = 1;
    const payload1 = Sage300AdvancedSettingModel.constructSkipExportPayload(valueField, this.skipExportForm.value.value1);
    this.advancedSettingsService.postExpenseFilter(payload1).subscribe((skipExport1: ExpenseFilterResponse) => {
      if (valueField.condition2 && valueField.operator2) {
        if (valueField.condition2.field_name === 'spent_at') {
          valueField.value2 = new Date(valueField.value2).toISOString().split('T')[0] + 'T17:00:00.000Z';
        }

        if (valueField.condition2.is_custom === true) {
          if (valueField.operator2 === 'is_empty') {
            valueField.value2 = ['True'];
            valueField.operator2 = 'isnull';
          } else if (valueField.operator2 === 'is_not_empty') {
            valueField.value2 = ['False'];
            valueField.operator2 = 'isnull';
          }
        }

        if (typeof valueField.value2 === 'string') {
          valueField.value2 = [valueField.value2];
        }
        valueField.rank = 2;
        const payload2 = Sage300AdvancedSettingModel.constructSkipExportPayload(valueField, this.skipExportForm.value.value2);
        this.advancedSettingsService.postExpenseFilter(payload2).subscribe((skipExport2: ExpenseFilterResponse) => {});
      }
    });
  }

  constructPayloadAndSave(){
    this.isSaveInProgress = true;
    if (!this.advancedSettingForm.value.skipExport && this.expenseFilters.results.length > 0){
      this.expenseFilters.results.forEach((value) => {
        this.deleteExpenseFilter(value.rank);
      });
    }
    if (this.advancedSettingForm.value.skipExport) {
      this.saveSkipExportFields();
    }
    this.isSaveInProgress = false;
  }

  save(): void {
    // TODO
    if (this.advancedSettingForm.valid && this.skipExportForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  private getSettingsAndSetupForm(): void {
    for (let i = 1; i <= 24; i++) {
      this.hours.push({ label: `${i}`, value: i });
    }
    forkJoin([
      this.advancedSettingsService.getAdvancedSettings().pipe(catchError(() => of(null))),
      this.exportSettingsService.getSage300ExportSettings(),
      // This.advancedSettingsService.getAdminEmail(),
      this.advancedSettingsService.getExpenseFilter(),
      this.advancedSettingsService.getExpenseFilelds()
    ]).subscribe(([sage300AdvancedSettingResponse, exportSettingsResponse, expenseFiltersGet, ExpenseFilterCondition]) => {
      this.advancedSetting = sage300AdvancedSettingResponse;
      // This.adminEmails = adminEmails;
      this.isReimbursableExpense = exportSettingsResponse.reimbursable_expenses_export_type ? true : false;
      this.expenseFilters = expenseFiltersGet;
      this.conditionFieldOptions = ExpenseFilterCondition;
      this.advancedSettingForm = Sage300AdvancedSettingModel.mapAPIResponseToFormGroup(this.advancedSetting);
      this.skipExportForm = SkipExportModel.setupSkipExportForm(this.expenseFilters, [], this.conditionFieldOptions);
      this.formWatchers();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
