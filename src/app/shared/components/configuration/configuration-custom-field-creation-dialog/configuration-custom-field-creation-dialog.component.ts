import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-configuration-custom-field-creation-dialog',
  templateUrl: './configuration-custom-field-creation-dialog.component.html',
  styleUrls: ['./configuration-custom-field-creation-dialog.component.scss']
})
export class ConfigurationCustomFieldCreationDialogComponent implements OnInit {

  @Input() customFieldForm: FormGroup;

  @Input() showCustomFieldCreationDialog: boolean;

  @Input() customFieldType: string;

  @Output() saveCustomFieldEmitter = new EventEmitter();

  @Output() closeModelEmitter = new EventEmitter();

  existingFields: string[] = ['employee id', 'organisation name', 'employee name', 'employee email', 'expense date', 'expense date', 'expense id', 'report id', 'employee id', 'department', 'state', 'reporter', 'report', 'purpose', 'vendor', 'category', 'category code', 'mileage distance', 'mileage unit', 'flight from city', 'flight to city', 'flight from date', 'flight to date', 'flight from class', 'flight to class', 'hotel checkin', 'hotel checkout', 'hotel location', 'hotel breakfast', 'currency', 'amount', 'foreign currency', 'foreign amount', 'tax', 'approver', 'project', 'billable', 'cost center', 'cost center code', 'approved on', 'reimbursable', 'receipts', 'paid date', 'expense created date'];

  constructor() { }

  saveCustomField() {
    this.saveCustomFieldEmitter.emit();
  }

  closeModel() {
    this.closeModelEmitter.emit();
  }

  ngOnInit(): void {
  }

}
