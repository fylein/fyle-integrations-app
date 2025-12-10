import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonSize, ButtonType } from 'src/app/core/models/enum/enum.model';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-csv-upload-button',
    imports: [TranslocoModule, SharedModule, TooltipModule],
    standalone: true,
    templateUrl: './csv-upload-button.component.html',
    styleUrl: './csv-upload-button.component.scss'
})
export class CsvUploadButtonComponent {

  @Input() buttonText: string = 'Upload CSV';

  @Input() fileName: string | null = null;

  @Input() showFileName: boolean = false;

  @Input() isDisabled: boolean = false;

  @Output() uploadClicked: EventEmitter<void> = new EventEmitter<void>();

  @Output() reuploadClicked: EventEmitter<void> = new EventEmitter<void>();

  readonly ButtonType = ButtonType;

  readonly ButtonSize = ButtonSize;

  handleUploadClick(): void {
    if (!this.isDisabled) {
      this.uploadClicked.emit();
    }
  }

  handleReuploadClick(): void {
    if (!this.isDisabled) {
      // Default to onUploadClick if onReuploadClick is not defined
      if (this.reuploadClicked.observed) {
        this.reuploadClicked.emit();
      } else {
        this.uploadClicked.emit();
      }
    }
  }
}
