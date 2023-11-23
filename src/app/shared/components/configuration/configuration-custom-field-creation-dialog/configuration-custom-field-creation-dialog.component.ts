import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-configuration-custom-field-creation-dialog',
  templateUrl: './configuration-custom-field-creation-dialog.component.html',
  styleUrls: ['./configuration-custom-field-creation-dialog.component.scss']
})
export class ConfigurationCustomFieldCreationDialogComponent implements OnInit {

  @Input() customFieldForm: FormGroup;

  @Input() showCustomFieldCreationDialog: boolean;

  @Output() saveCustomFieldFn = new EventEmitter();

  @Output() closeModelFn = new EventEmitter();

  existingFields: string[] = ['employee id', 'organisation name', 'employee name', 'employee email', 'expense date', 'expense date', 'expense id', 'report id', 'employee id', 'department', 'state', 'reporter', 'report', 'purpose', 'vendor', 'category', 'category code', 'mileage distance', 'mileage unit', 'flight from city', 'flight to city', 'flight from date', 'flight to date', 'flight from class', 'flight to class', 'hotel checkin', 'hotel checkout', 'hotel location', 'hotel breakfast', 'currency', 'amount', 'foreign currency', 'foreign amount', 'tax', 'approver', 'project', 'billable', 'cost center', 'cost center code', 'approved on', 'reimbursable', 'receipts', 'paid date', 'expense created date'];

  readonly brandingConfig = brandingConfig;

  constructor() { }

  saveCustomField() {
    this.saveCustomFieldFn.emit();
  }

  closeModel() {
    this.closeModelFn.emit();
  }

  ngOnInit(): void {
  }

}
