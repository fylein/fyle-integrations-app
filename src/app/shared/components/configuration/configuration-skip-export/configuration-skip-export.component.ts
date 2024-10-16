import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { ConditionField, ExpenseFilterResponse } from 'src/app/core/models/common/advanced-settings.model';
import { JoinOption } from 'src/app/core/models/enum/enum.model';
import { CustomOperatorOption } from 'src/app/core/models/intacct/intacct-configuration/advanced-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';

@Component({
  selector: 'app-configuration-skip-export',
  templateUrl: './configuration-skip-export.component.html',
  styleUrls: ['./configuration-skip-export.component.scss']
})
export class ConfigurationSkipExportComponent implements OnInit {

  @Input() enableSkipExport: boolean;

  @Input() skipExportForm: FormGroup;

  @Input() expenseFilter: ExpenseFilterResponse;

  @Input() conditionFieldOptions: ConditionField[];

  @Output() deleteSkipExportForm = new EventEmitter<number>();

  isLoading: boolean = true;

  showExpenseFilters: boolean;

  skippedCondition1: string;

  skippedCondition2: string;

  showAdditionalCondition: boolean = false;

  showAddButton: boolean = true;

  workspaceId: number;

  operatorFieldOptions1: { label: string; value: string }[];

  operatorFieldOptions2: { label: string; value: string }[];

  joinByOptions = [{label: 'AND', value: JoinOption.AND}, {label: 'OR', value: JoinOption.OR}];

  customOperatorOptions = [
    {
      label: 'Is',
      value: CustomOperatorOption.Is
    },
    {
      label: 'Is empty',
      value: CustomOperatorOption.IsEmpty
    },
    {
      label: 'Is not empty',
      value: CustomOperatorOption.IsNotEmpty
    }
  ];

  customSelectOperatorOptions = [
    {
      label: 'is',
      value: 'iexact'
    },
    {
      label: 'is not',
      value: 'not_in'
    }
  ];

  customCheckBoxValueOptions: { label: string; value: string; }[] = [
    {
      label: 'Yes',
      value: 'true'
    },
    {
      label: 'No',
      value: 'false'
    }
  ];

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly isAsterikAllowed: boolean = brandingFeatureConfig.isAsterikAllowed;

  constructor(
    private helper: HelperService
  ) { }

  private setConditionFields(response: ExpenseFilterResponse, conditionArray: ConditionField[]) {
    response.results?.forEach((element) => {
      const type = this.conditionFieldOptions.filter( (fieldOption) => fieldOption.field_name === element.condition);
      const selectedConditionOption : ConditionField = type[0];
      conditionArray.push(selectedConditionOption);
    });
  }

  private setOperatorFieldOptions(response: ExpenseFilterResponse, conditionArray: ConditionField[]) {
    if (conditionArray.length) {
      if (response.results[0].is_custom) {
        this.setCustomOperatorOptions(response.results[0].rank, response.results[0].custom_field_type);
      } else {
        this.operatorFieldOptions1 = this.setDefaultOperatorOptions(response.results[0].condition);
      }
      if (response.results[1]) {
        if (response.results[1].is_custom) {
          this.setCustomOperatorOptions(response.results[1].rank, response.results[1].custom_field_type);
        } else {
          this.operatorFieldOptions2 = this.setDefaultOperatorOptions(response.results[1].condition);
        }
      }
    }
  }

  private setSkippedConditions(response: ExpenseFilterResponse, conditionArray: ConditionField[]) {
    if (response.count > 0) {
      this.skippedCondition1 = conditionArray[0].field_name;
      if (response.count > 1 && response.results[0].join_by) {
        this.skippedCondition2 = conditionArray[1].field_name;
      } else {
        this.skippedCondition2 = '';
      }
    } else {
      this.skippedCondition1 = '';
      this.skippedCondition2 = '';
    }
  }

  conditionFieldWatcher() {
    this.skipExportForm.controls.condition1.valueChanges.subscribe(
      (conditionSelected) => {
        this.resetFields(
          this.skipExportForm.controls.operator1,
          this.skipExportForm.controls.value1,
          conditionSelected,
          1
        );
      }
    );

    this.skipExportForm.controls.condition2.valueChanges.subscribe(
      (conditionSelected) => {
        this.resetFields(
          this.skipExportForm.controls.operator2,
          this.skipExportForm.controls.value2,
          conditionSelected,
          2
        );
      }
    );
  }

  resetAdditionalFilter() {
    this.skipExportForm.controls.join_by.reset();
    this.skipExportForm.controls.condition2.reset();
    this.skipExportForm.controls.value2.reset();
  }

  resetFields(operator: AbstractControl, value: AbstractControl, conditionSelected: ConditionField, rank: number) {
    operator.reset();
    value.reset();
    if (rank === 1) {
      this.skipExportForm.controls.value1.reset();
    } else if (rank === 2) {
      this.skipExportForm.controls.value2.reset();
    }
    if (conditionSelected) {
      if (conditionSelected.is_custom) {
        this.setCustomOperatorOptions(rank, conditionSelected.type);
      } else if (!conditionSelected.is_custom) {
        if (rank === 1) {
          this.operatorFieldOptions1 = this.setDefaultOperatorOptions(
            conditionSelected.field_name
          );
        } else if (rank === 2) {
          this.operatorFieldOptions2 = this.setDefaultOperatorOptions(
            conditionSelected.field_name
          );
        }
      }
    }
  }

  updateAdditionalFilterVisibility(show: boolean) {
    this.showAdditionalCondition = show;
    this.showAddButton = !show;
    if (this.showAdditionalCondition) {
      const fields = ['join_by', 'condition2', 'operator2'];
      this.helper.handleSkipExportFormUpdates(this.skipExportForm, fields, true);
      if (this.skipExportForm.controls.value2.value?.length===0) {
        this.helper.markControllerAsRequired(this.skipExportForm, 'value2');
      }
    }
  }

  remCondition() {
    this.showAdditionalCondition = false;
    this.showAddButton = true;
    this.resetAdditionalFilter();
    const isDelete = this.expenseFilter.results.length > 1 ? this.deleteSkipExportForm.emit(this.expenseFilter.results[1].id) : '';
    const fields = ['join_by', 'condition2', 'operator2', 'value2'];
    this.helper.handleSkipExportFormUpdates(this.skipExportForm, fields, false);
  }

  checkValidationCondition() {
    const condition1 = this.skipExportForm.controls.condition1;
    const condition2 = this.skipExportForm.controls.condition2;
    if (this.showAdditionalCondition) {
      if (condition1.valid && condition2.valid) {
        if (condition1.value?.field_name === condition2.value?.field_name) {
          // This.skipExportForm.controls.operator2.setValue(null);
          return true;
        }
      }
    }
    return false;
  }

  // For conditionally adding and removing Value fields from layout
  showValueHeader(rank: number): boolean {
    return rank === 1 ? (this.skipExportForm.value.operator1 !== 'is_empty') && (this.skipExportForm.value.operator1 !== 'is_not_empty')
      : (this.skipExportForm.value.operator2 !== 'is_empty') && (this.skipExportForm.value.operator2 !== 'is_not_empty');
  }

  showInputField(rank: number) {
    return rank === 1 ? this.skipExportForm.value.condition1?.field_name === 'report_title' && (this.skipExportForm.value.operator1 !== 'is_empty' || this.skipExportForm.value.operator1 !== 'is_not_empty')
      : this.skipExportForm.value?.condition2?.field_name && this.skipExportForm.value?.condition2?.field_name === 'report_title'  && (this.skipExportForm.value.operator2 !== 'is_empty' || this.skipExportForm.value.operator2 !== 'is_not_empty');
  }

  showDateField(rank: number) {
    return rank === 1 ? this.skipExportForm.value?.condition1?.type==='DATE' && (this.skipExportForm.value.operator1 !== 'is_empty' || this.skipExportForm.value.operator1 !== 'is_not_empty')
      : this.skipExportForm.value?.condition2?.type==='DATE' && (this.skipExportForm.value.operator2 !== 'is_empty' || this.skipExportForm.value.operator2 !== 'is_not_empty');
  }

  showChipField(rank: number):boolean {
    return rank === 1 ?
      (this.skipExportForm.value.condition1?.field_name !== 'report_title') && (!this.skipExportForm.value.condition1 || this.skipExportForm.value.condition1.type==='SELECT' || this.skipExportForm.value?.condition1?.type==='TEXT' || this.skipExportForm.value?.condition1?.type==='NUMBER') && (this.skipExportForm.value.operator1 !== 'is_empty')  && (this.skipExportForm.value.operator1 !== 'is_not_empty')
      :(this.skipExportForm.value?.condition2?.field_name !== 'report_title') && (!this.skipExportForm.value?.condition2 || this.skipExportForm.value?.condition2?.type==='SELECT' || this.skipExportForm.value?.condition2?.type==='TEXT' || this.skipExportForm.value?.condition2?.type==='NUMBER') && (this.skipExportForm.value.operator2 !== 'is_empty')  && (this.skipExportForm.value.operator2 !== 'is_not_empty');
  }

  showBooleanField(rank: number) {
    return rank === 1 ? this.skipExportForm.value?.condition1?.type==='BOOLEAN' : this.skipExportForm.value?.condition2?.type==='BOOLEAN';
  }

  setDefaultOperatorOptions(conditionField: string) {
    const operatorList = [];
    if (
      conditionField === 'claim_number' ||
      conditionField === 'employee_email' ||
      conditionField === 'report_title' ||
      conditionField === 'category'
    ) {
      operatorList.push({
        value: 'iexact',
        label: 'is'
      });
    } else if (conditionField === 'spent_at') {
      operatorList.push({
        value: 'lt',
        label: 'is before'
      });
      operatorList.push({
        value: 'lte',
        label: 'is on or before'
      });
    }
    if (conditionField === 'report_title') {
      operatorList.push({
        value: 'icontains',
        label: 'contains'
      });
    } else if (conditionField === 'category') {
      operatorList.push({
        value: 'not_in',
        label: 'is not'
      });
    }
    return operatorList;
  }

  setCustomOperatorOptions(rank: number, type: string | null) {
    if (type === 'BOOLEAN') {
      const customCheckBoxOperatorOptions: { label: string; value: string; }[] = [
        {
          label: 'Is',
          value: 'iexact'
        }
      ];
      if (rank === 1) {
        this.operatorFieldOptions1 = customCheckBoxOperatorOptions;
      } else if (rank === 2) {
        this.operatorFieldOptions2 = customCheckBoxOperatorOptions;
      }
    } else if (type !== 'SELECT') {
      if (rank === 1) {
        this.operatorFieldOptions1 = this.customOperatorOptions;
      } else if (rank === 2) {
        this.operatorFieldOptions2 = this.customOperatorOptions;
      }
    } else {
      if (rank === 1) {
        this.operatorFieldOptions1 = this.customSelectOperatorOptions;
      } else if (rank === 2) {
        this.operatorFieldOptions2 = this.customSelectOperatorOptions;
      }
    }
  }

  setupSkipExportForm(response: ExpenseFilterResponse, conditionArray: ConditionField[]) {
    this.showAddButton = response.count !== 2 ? true : false;
    this.showAdditionalCondition = response.count === 2 ? true : false;
    this.setConditionFields(response, conditionArray);
    this.setOperatorFieldOptions(response, conditionArray);
    this.setSkippedConditions(response, conditionArray);
    this.conditionFieldWatcher();
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.setupSkipExportForm(this.expenseFilter, []);
  }
}