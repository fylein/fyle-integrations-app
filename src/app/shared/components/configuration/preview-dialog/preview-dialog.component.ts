import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig, brandingStyle } from 'src/app/branding/branding-config';
import { ButtonType, ButtonSize } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/common/helper.service';

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss']
})
export class PreviewDialogComponent implements OnInit {

  @Input() isPreviewDialogVisible: boolean;

  @Input() iconPath: string;

  @Input() header: string;

  @Input() showNavigation: boolean = false;

  @Input() currentModuleName: string;

  @Input() isFirstPreview: boolean = false;

  @Input() isLastPreview: boolean = false;

  @Input() autoSyncPaymentsPreviewClick: boolean = false;

  @Input() appName: string;

  @Output() closeDialog = new EventEmitter();

  @Output() navigatePreview = new EventEmitter<'next' | 'previous'>();

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    public helper: HelperService
  ) { }

  close() {
    this.closeDialog.emit();
  }

  onNavigate(direction: 'next' | 'previous') {
    this.navigatePreview.emit(direction);
  }

  ngOnInit(): void {
  }

}
