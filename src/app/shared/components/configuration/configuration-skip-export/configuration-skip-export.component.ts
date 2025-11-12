import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { ConditionField, ExpenseFilterResponse } from 'src/app/core/models/common/advanced-settings.model';
import { JoinOption } from 'src/app/core/models/enum/enum.model';
import { CustomOperatorOption } from 'src/app/core/models/intacct/intacct-configuration/advanced-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-configuration-skip-export',
    templateUrl: './configuration-skip-export.component.html',
    styleUrls: ['./configuration-skip-export.component.scss'],
    standalone: false
})
export class ConfigurationSkipExportComponent implements OnInit {

  @Input() enableSkipExport: boolean;

  @Input() skipExportForm: FormGroup;

  @Input() expenseFilter: ExpenseFilterResponse;

  @Input() conditionFieldOptions: ConditionField[];

  @Output() deleteSkipExportForm = new EventEmitter<number>();

  @Output() invalidSkipExportForm = new EventEmitter<boolean>();

  isLoading: boolean = true;

  showExpenseFilters: boolean;

  skippedCondition1: string;

  skippedCondition2: string;

  showAdditionalCondition: boolean = false;

  showAddButton: boolean = true;

  workspaceId: number;

  operatorFieldOptions1: { label: string; value: string }[];

  operatorFieldOptions2: { label: string; value: string }[];

  joinByOptions: {label: string; value: JoinOption}[];

  customOperatorOptions: {label: string; value: CustomOperatorOption}[];

  customSelectOperatorOptions: {label: string; value: string}[];

  customCheckBoxValueOptions: { label: string; value: string; }[];

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly isAsterikAllowed: boolean = brandingFeatureConfig.isAsterikAllowed;

  constructor(
    private helper: HelperService,
    private translocoService: TranslocoService
  ) { }

  private setConditionFields(response: ExpenseFilterResponse, conditionArray: ConditionField[]) {
    response.results.forEach((element) => {
      const type = this.conditionFieldOptions.filter( (fieldOption) => fieldOption.field_name.toLowerCase() === element.condition.toLowerCase());
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
          this.invalidSkipExportForm.emit(true);
          return true;
        }
      }
    }
    this.invalidSkipExportForm.emit(false);
    return false;
  }

  // For conditionally adding and removing Value fields from layout
  showValueHeader(rank: number): boolean {
    return rank === 1 ? (this.skipExportForm.get('operator1')?.value !== 'is_empty') && (this.skipExportForm.get('operator1')?.value !== 'is_not_empty')
      : (this.skipExportForm.get('operator2')?.value !== 'is_empty') && (this.skipExportForm.get('operator2')?.value !== 'is_not_empty');
  }

  showInputField(rank: number) {
    return rank === 1 ? this.skipExportForm.get('condition1')?.value?.field_name === 'report_title' && (this.skipExportForm.get('operator1')?.value !== 'is_empty' || this.skipExportForm.get('operator1')?.value !== 'is_not_empty')
      : this.skipExportForm.get('condition2')?.value?.field_name && this.skipExportForm.get('condition2')?.value?.field_name === 'report_title'  && (this.skipExportForm.get('operator2')?.value !== 'is_empty' || this.skipExportForm.get('operator2')?.value !== 'is_not_empty');
  }

  showDateField(rank: number) {
    return rank === 1 ? this.skipExportForm.get('condition1')?.value?.type==='DATE' && (this.skipExportForm.get('operator1')?.value !== 'is_empty' || this.skipExportForm.get('operator1')?.value !== 'is_not_empty')
      : this.skipExportForm.get('condition2')?.value?.type==='DATE' && (this.skipExportForm.get('operator2')?.value !== 'is_empty' || this.skipExportForm.get('operator2')?.value !== 'is_not_empty');
  }

  showChipField(rank: number):boolean {
    return rank === 1 ?
      (this.skipExportForm.get('condition1')?.value?.field_name !== 'report_title') && (!this.skipExportForm.get('condition1')?.value || this.skipExportForm.get('condition1')?.value.type==='SELECT' || this.skipExportForm.get('condition1')?.value?.type==='TEXT' || this.skipExportForm.get('condition1')?.value?.type==='NUMBER') && (this.skipExportForm.get('operator1')?.value !== 'is_empty')  && (this.skipExportForm.get('operator1')?.value !== 'is_not_empty')
      :(this.skipExportForm.get('condition2')?.value?.field_name !== 'report_title') && (!this.skipExportForm.get('condition2')?.value || this.skipExportForm.get('condition2')?.value?.type==='SELECT' || this.skipExportForm.get('condition2')?.value?.type==='TEXT' || this.skipExportForm.get('condition2')?.value?.type==='NUMBER') && (this.skipExportForm.get('operator2')?.value !== 'is_empty')  && (this.skipExportForm.get('operator2')?.value !== 'is_not_empty');
  }

  showBooleanField(rank: number) {
    return rank === 1 ? this.skipExportForm.get('condition1')?.value?.type==='BOOLEAN' : this.skipExportForm.get('condition2')?.value?.type==='BOOLEAN';
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
        label: this.translocoService.translate('configurationSkipExport.operatorIexact')
      });
    } else if (conditionField === 'spent_at') {
      operatorList.push({
        value: 'lt',
        label: this.translocoService.translate('configurationSkipExport.operatorIsBefore')
      });
      operatorList.push({
        value: 'lte',
        label: this.translocoService.translate('configurationSkipExport.operatorIsOnOrBefore')
      });
    }
    if (conditionField === 'report_title') {
      operatorList.push({
        value: 'icontains',
        label: this.translocoService.translate('configurationSkipExport.operatorContains')
      });
    } else if (conditionField === 'category') {
      operatorList.push({
        value: 'not_in',
        label: this.translocoService.translate('configurationSkipExport.operatorNotIn')
      });
    }
    return operatorList;
  }

  setCustomOperatorOptions(rank: number, type: string | null) {
    if (type === 'BOOLEAN') {
      const customCheckBoxOperatorOptions: { label: string; value: string; }[] = [
        {
          label: this.translocoService.translate('configurationSkipExport.operatorIs'),
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

  private setupComponentOptions(): void {
    this.joinByOptions = [{label: this.translocoService.translate('configurationSkipExport.joinByAnd'), value: JoinOption.AND}, {label: this.translocoService.translate('configurationSkipExport.joinByOr'), value: JoinOption.OR}];

    this.customOperatorOptions = [
      {
        label: this.translocoService.translate('configurationSkipExport.operatorIs'),
        value: CustomOperatorOption.Is
      },
      {
        label: this.translocoService.translate('configurationSkipExport.operatorIsEmpty'),
        value: CustomOperatorOption.IsEmpty
      },
      {
        label: this.translocoService.translate('configurationSkipExport.operatorIsNotEmpty'),
        value: CustomOperatorOption.IsNotEmpty
      }
    ];

    this.customSelectOperatorOptions = [
      {
        label: this.translocoService.translate('configurationSkipExport.operatorIexact'),
        value: 'iexact'
      },
      {
        label: this.translocoService.translate('configurationSkipExport.operatorNotIn'),
        value: 'not_in'
      }
    ];

    this.customCheckBoxValueOptions = [
      {
        label: this.translocoService.translate('configurationSkipExport.optionYes'),
        value: 'true'
      },
      {
        label: this.translocoService.translate('configurationSkipExport.optionNo'),
        value: 'false'
      }
    ];
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
    this.setupComponentOptions();
    this.setupSkipExportForm(this.expenseFilter, []);
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
