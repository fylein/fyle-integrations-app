import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig } from 'src/app/branding/branding-config';
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

  @Output() closeDialog = new EventEmitter();

  @Output() navigatePreview = new EventEmitter<'next' | 'previous'>();

  readonly brandingConfig = brandingConfig;

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
