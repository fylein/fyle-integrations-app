import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { ButtonSize, ButtonType } from 'src/app/core/models/enum/enum.model';

@Component({
    selector: 'app-configuration-custom-field-creation-dialog',
    templateUrl: './configuration-custom-field-creation-dialog.component.html',
    styleUrls: ['./configuration-custom-field-creation-dialog.component.scss'],
    standalone: false
})
export class ConfigurationCustomFieldCreationDialogComponent implements OnInit {

  @Input() customFieldForm: FormGroup;

  @Input() showCustomFieldCreationDialog: boolean;

  @Output() saveCustomFieldFn = new EventEmitter();

  @Output() closeModelFn = new EventEmitter();

  private pendingAction: 'close' | 'save' | null = null;

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  existingFields: string[] = ['merchant', 'employee id', 'organisation name', 'employee name', 'employee email', 'expense date', 'expense date', 'expense id', 'report id', 'employee id', 'department', 'state', 'reporter', 'report', 'purpose', 'vendor', 'category', 'category code', 'mileage distance', 'mileage unit', 'flight from city', 'flight to city', 'flight from date', 'flight to date', 'flight from class', 'flight to class', 'hotel checkin', 'hotel checkout', 'hotel location', 'hotel breakfast', 'currency', 'amount', 'foreign currency', 'foreign amount', 'tax', 'approver', 'project', 'billable', 'cost center', 'cost center code', 'approved on', 'reimbursable', 'receipts', 'paid date', 'expense created date'];

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly isAsterikAllowed: boolean = brandingFeatureConfig.isAsterikAllowed;

  constructor() { }

  saveCustomField() {
    this.pendingAction = 'save';
    this.showCustomFieldCreationDialog = false;
  }

  closeModel() {
    this.pendingAction = 'close';
    this.showCustomFieldCreationDialog = false;
  }

  onDialogHide() {
    if (this.pendingAction === 'save') {
      this.saveCustomFieldFn.emit();
    } else if (this.pendingAction === 'close') {
      this.closeModelFn.emit();
    }
    this.pendingAction = null;
  }

  ngOnInit(): void {
  }

}
