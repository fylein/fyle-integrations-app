import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { Sage300SharedModule } from "src/app/integrations/sage300/sage300-shared/sage300-shared.module";
import { ButtonSize, ButtonType, Sage50AttributeType } from 'src/app/core/models/enum/enum.model';
import { CsvUploadButtonComponent } from "../../input/csv-upload-button/csv-upload-button.component";
import { CsvUploadDialogComponent } from '../../dialog/csv-upload-dialog/csv-upload-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { sage50AttributeDisplayNames } from 'src/app/core/models/sage50/sage50-configuration/attribute-display-names';

@Component({
  selector: 'app-configuration-csv-upload-field',
  standalone: true,
  imports: [TranslocoModule, Sage300SharedModule, CsvUploadButtonComponent],
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
    public dialogService: DialogService
  ) { }

  handleUploadClick() {
    const displayName = sage50AttributeDisplayNames[this.attributeType];
    this.ref = this.dialogService.open(CsvUploadDialogComponent, {
      header: `Upload CSV for ${displayName}`,
      data: {
        attributeType: this.attributeType,
        articleLink: this.articleLink,
        videoURL: this.videoURL
      }
    });
  }

}
