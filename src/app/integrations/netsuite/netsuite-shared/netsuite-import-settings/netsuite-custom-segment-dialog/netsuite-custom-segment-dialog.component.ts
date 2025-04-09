import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingContent } from 'src/app/branding/branding-config';
import { brandingConfig } from 'src/app/branding/c1-content-config';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { NetsuiteCustomSegmentOption } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-netsuite-custom-segment-dialog',
  templateUrl: './netsuite-custom-segment-dialog.component.html',
  styleUrls: ['./netsuite-custom-segment-dialog.component.scss']
})
export class NetsuiteCustomSegmentDialogComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() isLoading: boolean;

  @Input() isCustomSegmentDialogVisible: boolean;

  @Input() options: SelectFormOption[];

  @Output() saveClick = new EventEmitter();

  @Output() closeDialog = new EventEmitter();

  isCustomTypeSelectionActive: boolean = true;

  isInternalIDSelectionActive: boolean = false;

  isTransactionLineSectionActive: boolean = false;

  stepNumber: number = 1;

  readonly brandingContent = brandingContent.netsuite.configuration.importSetting;

  readonly brandingConfig = brandingConfig;

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
      return this.form.controls.customFieldType.invalid;
    }
    return this.form.controls.internalId.invalid;
  }

  setImagesForCustomSegment(): string {
    if (this.stepNumber === 1) {
      return 'assets/illustrations/netsuite/custom-field-type.mov';
    } else if (this.stepNumber === 2) {
      return this.getCustomSegmentImage();
    }
    return 'assets/illustrations/netsuite/png/field-line-item.png';
  }

  getCustomSegmentImage(): string {
    if (this.form.controls.customFieldType.value === NetsuiteCustomSegmentOption.CUSTOM_LIST) {
      return 'assets/illustrations/netsuite/png/custom-list.png';
    } else if (this.form.controls.customFieldType.value === NetsuiteCustomSegmentOption.CUSTOM_RECORD) {
      return 'assets/illustrations/netsuite/png/custom-record.png';
    }
    return 'assets/illustrations/netsuite/png/custom-segment.png';
  }

  ngOnInit(): void {
  }

}
