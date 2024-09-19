import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { brandingConfig } from 'src/app/branding/branding-config';
import type { HelperService } from 'src/app/core/services/common/helper.service';

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss']
})
export class PreviewDialogComponent implements OnInit {

  @Input() isPreviewDialogVisible: boolean;

  @Input() iconPath: string;

  @Input() header: string;

  @Output() closeDialog = new EventEmitter();

  readonly brandingConfig = brandingConfig;

  constructor(
    public helper: HelperService
  ) { }

  close() {
    this.closeDialog.emit();
  }

  ngOnInit(): void {
  }

}
