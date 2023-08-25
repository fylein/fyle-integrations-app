import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

const SYSTEM_FIELDS: string[] = ['employee id', 'organisation name', 'employee name', 'employee email', 'expense date', 'expense date', 'expense id', 'report id', 'employee id', 'department', 'state', 'reporter', 'report', 'purpose', 'vendor', 'category', 'category code', 'mileage distance', 'mileage unit', 'flight from city', 'flight to city', 'flight from date', 'flight to date', 'flight from class', 'flight to class', 'hotel checkin', 'hotel checkout', 'hotel location', 'hotel breakfast', 'currency', 'amount', 'foreign currency', 'foreign amount', 'tax', 'approver', 'project', 'billable', 'cost center', 'cost center code', 'approved on', 'reimbursable', 'receipts', 'paid date', 'expense created date'];

@Component({
  selector: 'app-expense-field-creation-dialog',
  templateUrl: './expense-field-creation-dialog.component.html',
  styleUrls: ['./expense-field-creation-dialog.component.scss']
})
export class ExpenseFieldCreationDialogComponent implements OnInit {

  expenseFieldsCreationForm: FormGroup;

  existingFields: string[];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private formBuilder: FormBuilder
  ) { }

  private setupForm(): void {
    this.expenseFieldsCreationForm = this.formBuilder.group({
      name: ['', Validators.required],
      placeholder: ['']
    });

    if (!this.config.data.length) {
      this.config.data = [];
    }

    this.existingFields = this.config.data.concat(SYSTEM_FIELDS);
  }

  save(): void {
    const expenseField = {
      name: this.expenseFieldsCreationForm.get('name')?.value,
      source_placeholder: this.expenseFieldsCreationForm.get('placeholder')?.value
    };
    this.ref.close(expenseField);
  }

  ngOnInit(): void {
    this.setupForm();
  }

  closeDialog(): void {
    this.ref.close();
  }

}
