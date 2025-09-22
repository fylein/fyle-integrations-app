import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ButtonSize, ButtonType, Sage50AttributeType } from 'src/app/core/models/enum/enum.model';
import { CsvUploadButtonComponent } from "../../input/csv-upload-button/csv-upload-button.component";
import { CsvUploadDialogComponent } from '../../dialog/csv-upload-dialog/csv-upload-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { sage50AttributeDisplayNames } from 'src/app/core/models/sage50/sage50-configuration/attribute-display-names';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-configuration-csv-upload-field',
  standalone: true,
  imports: [TranslocoModule, SharedModule, CsvUploadButtonComponent],
  providers: [DialogService],
  templateUrl: './configuration-csv-upload-field.component.html',
  styleUrl: './configuration-csv-upload-field.component.scss'
})
export class ConfigurationCsvUploadFieldComponent {

  @Input({ required: true }) attributeType!: Sage50AttributeType;

  @Input({ required: true }) label!: string;

  @Input({ required: true }) subLabel!: string;

  @Input() articleLink!: string;

  @Input() videoURL!: string;

  @Input() fileName: string | null = null;

  @Output() fileNameChange = new EventEmitter<string | null>();

  readonly ButtonType = ButtonType;

  readonly ButtonSize = ButtonSize;

  ref?: DynamicDialogRef;

  constructor(
    public dialogService: DialogService,
    public translocoService: TranslocoService
  ) { }

  handleUploadClick() {
    const displayName = sage50AttributeDisplayNames[this.attributeType];
    this.ref = this.dialogService.open(CsvUploadDialogComponent, {
      header: this.translocoService.translate('configurationCsvUploadField.header', { dimension: displayName }),
      data: {
        attributeType: this.attributeType,
        articleLink: this.articleLink,
        videoURL: this.videoURL
      }
    });
  }

}
