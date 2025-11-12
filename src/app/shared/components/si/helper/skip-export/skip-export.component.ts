import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { constructPayload1, constructPayload2 } from 'src/app/core/models/intacct/misc/skip-export.model';
import { ConditionField, CustomOperatorOption, ExpenseFilterResponse, JoinOptions, SkipExport } from 'src/app/core/models/intacct/intacct-configuration/advanced-settings.model';
import { SiAdvancedSettingsService } from 'src/app/core/services/si/si-configuration/si-advanced-settings.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-skip-export',
    templateUrl: './skip-export.component.html',
    styleUrls: ['./skip-export.component.scss'],
    standalone: false
})
export class SkipExportComponent implements OnInit {

  @Input() enableSkipExport: boolean;

  @Input() skipExportForm: FormGroup;

  @Output() skipExportFormChange = new EventEmitter<FormGroup>();

  @Output() invalidSkipExportForm = new EventEmitter<boolean>();

  isLoading: boolean = true;

  expenseFilters: SkipExport[];

  showExpenseFilters: boolean;

  skippedCondition1: string;

  skippedCondition2: string;

  isDisabledChip1: boolean = false;

  isDisabledChip2: boolean = false;

  showAdditionalCondition: boolean = false;

  showAddButton: boolean = true;

  workspaceId: number;

  conditionFieldOptions: ConditionField[];

  operatorFieldOptions1: { label: string; value: string }[];

  operatorFieldOptions2: { label: string; value: string }[];

  joinByOptions = [{value: JoinOptions.AND}, {value: JoinOptions.OR}];

  customOperatorOptions: { label: string; value: any; }[];

  customSelectOperatorOptions: { label: string; value: string; }[];

  valueOption1: any[] = [];

  valueOption2: any[] = [];

  customCheckBoxValueOptions: { label: string; value: string; }[];

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private advancedSettingsService: SiAdvancedSettingsService,
    private translocoService: TranslocoService
  ) {
    this.customOperatorOptions = [
      {
        label: this.translocoService.translate('skipExport.isOperator'),
        value: CustomOperatorOption.Is
      },
      {
        label: this.translocoService.translate('skipExport.isEmptyOperator'),
        value: CustomOperatorOption.IsEmpty
      },
      {
        label: this.translocoService.translate('skipExport.isNotEmptyOperator'),
        value: CustomOperatorOption.IsNotEmpty
      }
    ];

    this.customSelectOperatorOptions = [
      {
        label: this.translocoService.translate('skipExport.isOperatorSelect'),
        value: 'iexact'
      },
      {
        label: this.translocoService.translate('skipExport.isNotOperatorSelect'),
        value: 'not_in'
      }
    ];

    this.customCheckBoxValueOptions = [
      {
        label: this.translocoService.translate('skipExport.yes'),
        value: 'true'
      },
      {
        label: this.translocoService.translate('skipExport.no'),
        value: 'false'
      }
    ];
  }

  private skipExportWatcher(): void {

      this.skipExportForm.valueChanges.subscribe(() => {
        this.skipExportFormChange.emit(this.skipExportForm);
      });

      if (this.enableSkipExport) {
        this.skipExportForm.controls.condition1.setValidators(Validators.required);
        this.skipExportForm.controls.operator1.setValidators(Validators.required);
        this.skipExportForm.controls.value1.setValidators(Validators.required);
      } else {
        this.skipExportForm.reset();
        this.skipExportForm.controls.condition1.clearValidators();
        this.skipExportForm.controls.operator1.clearValidators();
        this.skipExportForm.controls.condition1.setValue(null);
        this.skipExportForm.controls.operator1.setValue(null);
        this.skipExportForm.controls.value1.clearValidators();
        this.skipExportForm.controls.value1.setValue(null);
        this.skipExportForm.controls.join_by.clearValidators();
        this.skipExportForm.controls.join_by.setValue(null);
        this.skipExportForm.controls.condition2.clearValidators();
        this.skipExportForm.controls.operator2.clearValidators();
        this.skipExportForm.controls.condition2.setValue(null);
        this.skipExportForm.controls.operator2.setValue(null);
        this.skipExportForm.controls.value2.clearValidators();
        this.skipExportForm.controls.value2.setValue(null);
        this.showAdditionalCondition = false;
        this.showAddButton = true;
      }
  }

  private setConditionFields(response: ExpenseFilterResponse, conditionArray: ConditionField[]) {
    response.results.forEach((element) => {
      const type = this.conditionFieldOptions.filter((fieldOption) => fieldOption.field_name.toLowerCase() === element.condition.toLowerCase());
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
      if (response.results[0].join_by !== null) {
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

  getSelectedOperator(operator: string, value: any, condition: ConditionField) {
    switch (operator) {
      case 'isnull': {
        return value === 'True' ? 'is_empty' : 'is_not_empty';
      }
      case 'in':
        return 'iexact';
      case 'iexact': return operator;
      default: return operator;
    }
  }

  getFieldValue(value: any, condition: ConditionField, rank: number) {
    if (condition.type === 'DATE') {
      return new Date(value[0]);
    } else if (condition.field_name === 'report_title' || condition.type === 'BOOLEAN') {
      return value[0];
    }
      if (rank === 1) {
        this.valueOption1 = value;
      } else if (rank === 2) {
        this.valueOption2 = value;
      }
        return '';

  }

  resetAdditionalFilter() {
    this.skipExportForm.controls.join_by.reset();
    this.skipExportForm.controls.condition2.reset();
    this.valueOption2=[];
  }

  resetFields(operator: AbstractControl, value: AbstractControl, conditionSelected: ConditionField, rank: number) {

    operator.reset();
    value.reset();
    if (rank === 1) {
      this.valueOption1 = [];
    } else if (rank === 2) {
      this.valueOption2 = [];
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
      this.skipExportForm.controls.join_by.setValidators(Validators.required);
      this.skipExportForm.controls.condition2.setValidators([Validators.required, RxwebValidators.unique()]);
      this.skipExportForm.controls.operator2.setValidators(Validators.required);
      if (this.valueOption2.length===0) {
        this.skipExportForm.controls.value2.setValidators(Validators.required);
      }
    }
  }

  remCondition() {
    this.showAdditionalCondition = false;
    this.showAddButton = true;
    this.resetAdditionalFilter();
    this.skipExportForm.controls.join_by.clearValidators();
    this.skipExportForm.controls.join_by.setValue(null);
    this.skipExportForm.controls.condition2.clearValidators();
    this.skipExportForm.controls.condition2.setValue(null);
    this.skipExportForm.controls.operator2.clearValidators();
    this.skipExportForm.controls.operator2.setValue(null);
    this.skipExportForm.controls.value2.clearValidators();
    this.skipExportForm.controls.value2.setValue(null);
  }

  checkValidationCondition() {
    const condition1 = this.skipExportForm.controls.condition1;
    const condition2 = this.skipExportForm.controls.condition2;
    if (this.showAdditionalCondition) {
      if (condition1.valid && condition2.valid) {
        if (condition1.value?.field_name === condition2.value?.field_name) {
            this.invalidSkipExportForm.emit(true);
            return true;
          }
      }
    }
    this.invalidSkipExportForm.emit(false);
    return false;
  }

  // For conditionally adding and removing Value fields from layout
  showValueHeader1(): boolean {
    return (this.skipExportForm.get('operator1')?.value !== 'is_empty') && (this.skipExportForm.get('operator1')?.value !== 'is_not_empty');
  }

  showValueHeader2() {
    return (this.skipExportForm.get('operator2')?.value !== 'is_empty') && (this.skipExportForm.get('operator2')?.value !== 'is_not_empty');
  }

  showInputField1() {
    return this.skipExportForm.get('condition1')?.value?.field_name === 'report_title' && (this.skipExportForm.get('operator1')?.value !== 'is_empty' || this.skipExportForm.get('operator1')?.value !== 'is_not_empty');
  }

  showChipField1() {
    return (this.skipExportForm.get('condition1')?.value?.field_name !== 'report_title') && (!this.skipExportForm.get('condition1')?.value || this.skipExportForm.get('condition1')?.value.type==='SELECT' || this.skipExportForm.get('condition1')?.value?.type==='TEXT' || this.skipExportForm.get('condition1')?.value?.type==='NUMBER') && (this.skipExportForm.get('operator1')?.value !== 'is_empty')  && (this.skipExportForm.get('operator1')?.value !== 'is_not_empty');
  }

  showDateField1() {
    return this.skipExportForm.get('condition1')?.value?.type==='DATE' && (this.skipExportForm.get('operator1')?.value !== 'is_empty' || this.skipExportForm.get('operator1')?.value !== 'is_not_empty');
  }

  showBooleanField1() {
    return this.skipExportForm.get('condition1')?.value?.type==='BOOLEAN';
  }

  showInputField2() {
    return this.skipExportForm.value?.condition2?.field_name && this.skipExportForm.value?.condition2?.field_name === 'report_title'  && (this.skipExportForm.get('operator2')?.value !== 'is_empty' || this.skipExportForm.get('operator2')?.value !== 'is_not_empty');
  }

  showChipField2(): boolean {
    return this.skipExportForm.value?.condition2?.field_name !== 'report_title' && (!this.skipExportForm.value?.condition2 || this.skipExportForm.value?.condition2?.type==='SELECT' || this.skipExportForm.value?.condition2?.type==='TEXT' || this.skipExportForm.value?.condition2?.type==='NUMBER') && (this.skipExportForm.get('operator2')?.value !== 'is_empty')  && (this.skipExportForm.get('operator2')?.value !== 'is_not_empty');
  }

  showDateField2() {
    return this.skipExportForm.value?.condition2?.type==='DATE' && (this.skipExportForm.get('operator2')?.value !== 'is_empty' || this.skipExportForm.get('operator2')?.value !== 'is_not_empty');
  }

  showBooleanField2() {
    return this.skipExportForm.value?.condition2?.type==='BOOLEAN';
  }

  saveSkipExportFields() {
    if (!this.skipExportForm.valid) {
      return;
    }

    const valueField = this.skipExportForm.getRawValue();
    if (this.showAddButton && this.expenseFilters?.length > 1) {
      this.advancedSettingsService
      .deleteExpenseFilter(this.expenseFilters[1].rank)
      .subscribe((skipExport1: SkipExport) => {
      });
    }
    if (!this.enableSkipExport) {
      this.advancedSettingsService
      .deleteExpenseFilter(this.expenseFilters[0].rank)
      .subscribe((skipExport1: SkipExport) => {
      });
    } else {
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
    const payload1 = constructPayload1(valueField, this.valueOption1);
    this.advancedSettingsService
      .postExpenseFilter(payload1)
      .subscribe((skipExport1: SkipExport) => {
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
            const payload2 = constructPayload2(valueField, this.valueOption2);
            this.advancedSettingsService
              .postExpenseFilter(payload2)
              .subscribe((skipExport2: SkipExport) => {});
        }
      });
    }
  }

  setDefaultOperatorOptions(conditionField: string) {
    conditionField = conditionField.toLowerCase();
    const operatorList = [];
    if (
      conditionField === 'claim_number' ||
      conditionField === 'employee_email' ||
      conditionField === 'report_title' ||
      conditionField === 'category'
    ) {
      operatorList.push({
        value: 'iexact',
        label: this.translocoService.translate('skipExport.isOperatorSelect')
      });
    } else if (conditionField === 'spent_at') {
      operatorList.push({
        value: 'lt',
        label: this.translocoService.translate('skipExport.isBeforeOperator')
      });
      operatorList.push({
        value: 'lte',
        label: this.translocoService.translate('skipExport.isOnOrBeforeOperator')
      });
    }
    if (conditionField === 'report_title') {
      operatorList.push({
        value: 'icontains',
        label: this.translocoService.translate('skipExport.containsOperator')
      });
    } else if (conditionField === 'category') {
      operatorList.push({
        value: 'not_in',
        label: this.translocoService.translate('skipExport.isNotOperatorSelect')
      });
    }
    return operatorList;
  }

  setCustomOperatorOptions(rank: number, type: string) {
    if (type === 'BOOLEAN') {
      const customCheckBoxOperatorOptions: { label: string; value: string; }[] = [
        {
          label: this.translocoService.translate('skipExport.isOperator'),
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

  operatorFieldWatcher() {
    this.skipExportForm.controls.operator1.valueChanges.subscribe((operatorSelected) => {
        this.valueOption1 = [];
        if (operatorSelected === 'is_empty' || operatorSelected === 'is_not_empty') {
          this.isDisabledChip1 = true;
          this.skipExportForm.controls.value1.clearValidators();
          this.skipExportForm.controls.value1.setValue(null);
        } else {
          this.isDisabledChip1 = false;
          this.skipExportForm.controls.value1.setValidators(Validators.required);
          this.skipExportForm.controls.value1.setValue(null, {emitEvent: false});
        }
      }
    );

    this.skipExportForm.controls.operator2.valueChanges.subscribe(
      (operatorSelected) => {
        this.valueOption2 = [];
        if (
          operatorSelected === 'is_empty' ||
          operatorSelected === 'is_not_empty'
        ) {
          this.isDisabledChip2 = true;
          this.skipExportForm.controls.value2.clearValidators();
          this.skipExportForm.controls.value2.setValue(null);
        } else {
          this.isDisabledChip2 = false;
          this.skipExportForm.controls.value2.setValidators([Validators.required]);
          this.skipExportForm.controls.value2.setValue(null, {emitEvent: false});
        }
      }
    );
  }

  fieldWatcher() {
    this.skipExportWatcher();
    this.conditionFieldWatcher();
    this.operatorFieldWatcher();
  }

  compareObjects(selectedOption: any, listedOption: any): boolean {
    if (JSON.stringify(selectedOption) === JSON.stringify(listedOption)) {
      return true;
    }
    return false;
  }

  setupSkipExportForm(response: ExpenseFilterResponse, conditionArray: ConditionField[]) {
    this.isLoading = true;
    this.showExpenseFilters = response.count > 0;
    this.setConditionFields(response, conditionArray);
    this.setOperatorFieldOptions(response, conditionArray);
    this.setSkippedConditions(response, conditionArray);
    let [selectedOperator1, valueFC1, customFieldTypeFC1] = ['', '', ''];
    let [selectedOperator2, valueFC2] = ['', ''];
    let joinByFC = '';

    response.results.forEach((result, index) => {
      if (index === 0) {
        selectedOperator1 = this.getSelectedOperator(result.operator, result.values[0], conditionArray[0]);
        if (!(selectedOperator1 === 'is_empty' || selectedOperator1 === 'is_not_empty')) {
          valueFC1 = this.getFieldValue(result.values, conditionArray[0], result.rank);
        } else {
          this.isDisabledChip1 = true;
        }
        customFieldTypeFC1 = result.custom_field_type;
      } else if (index === 1 && response.results[0].join_by !== null) {
        selectedOperator2 = this.getSelectedOperator(result.operator, result.values[0], conditionArray[1]);
        joinByFC = response.results[0].join_by;
        if (!(selectedOperator2 === 'is_empty' || selectedOperator2 === 'is_not_empty')) {
          valueFC2 = this.getFieldValue(result.values, conditionArray[1], result.rank);
        } else {
          this.isDisabledChip2 = true;
        }
      }
    });

    this.skipExportForm = this.formBuilder.group({
      condition1: [conditionArray.length > 0 ? conditionArray[0] : ''],
      operator1: [selectedOperator1],
      value1: [valueFC1],
      customFieldType1: [customFieldTypeFC1],
      join_by: [{value: joinByFC}],
      condition2: [joinByFC ? conditionArray[1] : ''],
      operator2: [joinByFC && selectedOperator2 ? selectedOperator2 : ''],
      value2: [valueFC2],
      customFieldType2: joinByFC ? [response.results[1].custom_field_type] : ['']
    });

    if (response.count) {
      this.skipExportForm.controls.condition1.setValidators(Validators.required);
      this.skipExportForm.controls.operator1.setValidators(Validators.required);
      if (!this.valueOption1.length && !(selectedOperator1 === 'is_empty' || selectedOperator1 === 'is_not_empty')) {
        this.skipExportForm.controls.value1.setValidators(Validators.required);
      }
      if (response.count === 2) {
        this.showAdditionalCondition = true;
        this.showAddButton = false;
        this.skipExportForm.controls.condition2.setValidators([Validators.required, RxwebValidators.unique()]);
        this.skipExportForm.controls.operator2.setValidators(Validators.required);
        this.skipExportForm.controls.join_by.setValidators(Validators.required);
        if (!this.valueOption2.length && !(selectedOperator2 === 'is_empty' || selectedOperator2 === 'is_not_empty')) {
          this.skipExportForm.controls.value2.setValidators(Validators.required);
        }
      }
    }
    this.fieldWatcher();
    this.isLoading = false;
  }

  private getSettingsAndSetupForm(): void {
    forkJoin([
      this.advancedSettingsService.getExpenseFilter(),
      this.advancedSettingsService.getFyleCustomFields()
    ]).subscribe((responses) => {
      this.expenseFilters = responses[0].results;
      this.conditionFieldOptions = responses[1];
      this.setupSkipExportForm(responses[0], []);
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

  // Methods for p-autocomplete functionality (replacing p-autocomplete)
    onKeyDown(event: any, fieldNumber: number): void {
    const keyboardEvent = event as KeyboardEvent;
    const target = keyboardEvent.target as HTMLInputElement;
    // Handle comma and Enter key to add chips (replaces separator="," functionality)
    if ((keyboardEvent.key === ',' || keyboardEvent.key === 'Enter') && target.value.trim()) {
      keyboardEvent.preventDefault();
      this.addChip(target.value.trim(), target, fieldNumber);
    }
  }

  onBlur(event: any, fieldNumber: number): void {
    const target = event.target as HTMLInputElement;
    // Replaces [addOnBlur]="true" functionality
    if (target.value.trim()) {
      this.addChip(target.value.trim(), target, fieldNumber);
    }
  }

  private addChip(value: string, inputElement: HTMLInputElement, fieldNumber: number): void {
    const formControlName = fieldNumber === 1 ? 'value1' : 'value2';
    const currentValues = this.skipExportForm.get(formControlName)?.value || [];

    // Avoid duplicates
    if (!currentValues.includes(value)) {
      const newValues = [...currentValues, value];
      this.skipExportForm.get(formControlName)?.setValue(newValues);
      inputElement.value = ''; // Clear input after adding
    }
  }
}
