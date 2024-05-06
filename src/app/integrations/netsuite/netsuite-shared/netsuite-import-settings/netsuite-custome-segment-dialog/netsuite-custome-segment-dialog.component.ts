import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingConfig } from 'src/app/branding/c1-contents-config';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { NetsuiteCustomeSegmentOption } from 'src/app/core/models/enum/enum.model';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
  selector: 'app-netsuite-custome-segment-dialog',
  templateUrl: './netsuite-custome-segment-dialog.component.html',
  styleUrls: ['./netsuite-custome-segment-dialog.component.scss']
})
export class NetsuiteCustomeSegmentDialogComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() isLoading: boolean;

  @Input() isCustomeSegmentDialogVisible: boolean;

  @Input() options: SelectFormOption[];

  @Output() saveClick = new EventEmitter();

  @Output() closeDialog = new EventEmitter();

  isCustomTypeSelectionActive: boolean = true;

  isInternalIDSelectionActive: boolean = false;

  isTransactionLineSectionActive: boolean = false;

  stepNumber: number = 1;

  readonly brandConfig = brandingConfig;

  constructor() { }

  save() {
    this.saveClick.emit();
  }

  close() {
    this.closeDialog.emit();
  }

  proceedToNextStep(stepNumber: number) {
    if (stepNumber === 1) {
      this.isCustomTypeSelectionActive = false;
      this.isInternalIDSelectionActive = true;
      this.isTransactionLineSectionActive = false;
      this.stepNumber = 2;
    } else {
      this.isCustomTypeSelectionActive = false;
      this.isInternalIDSelectionActive = false;
      this.isTransactionLineSectionActive = true;
      this.stepNumber = 3;
    }
  }

  isDisabled(): boolean {
    if (this.stepNumber === 1) {
      return this.form.controls.custom_field_type.invalid;
    }
    return this.form.controls.internal_id.invalid;
  }

  getCustomeSegmentTypeLabel(): string {
    return brandingConfig.brandId === 'co' ? 'Choose custom field type' : 'Choose Custom Field Type';
  }

  getInternalIDLabel(): string {
    if (brandingConfig.brandId === 'co') {
      return 'Enter ' + new SentenceCasePipe().transform(new SnakeCaseToSpaceCasePipe().transform(this.form.controls.custom_field_type.value)) + ' internal ID';
    }
    return 'Enter ' + new TitleCasePipe().transform(new SnakeCaseToSpaceCasePipe().transform(this.form.controls.custom_field_type.value)) + ' Internal ID';
  }

  getTransactionIdLabel(): string {
    return this.brandConfig.brandId === 'co' ? new SnakeCaseToSpaceCasePipe().transform('Enter Transaction Line Field ID') : 'Enter Transaction Line Field ID';
  }

  getCustomSegmentImage(): string {
    if (this.form.controls.custom_field_type.value === NetsuiteCustomeSegmentOption.CUSTOM_LIST) {
      return 'assets/illustrations/netsuite/png/custom-list.png';
    } else if (this.form.controls.custom_field_type.value === NetsuiteCustomeSegmentOption.CUSTOM_RECORD) {
      return 'assets/illustrations/netsuite/png/custom-record.png';
    }
    return 'assets/illustrations/netsuite/png/custom-segment.png';
  }

  ngOnInit(): void {
  }

}
