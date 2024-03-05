import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig } from 'src/app/branding/branding-config';

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

  constructor() { }

  close() {
    this.closeDialog.emit();
  }

  ngOnInit(): void {
  }

}
