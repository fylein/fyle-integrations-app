import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ButtonSize, ButtonType, Sage50AttributeType } from 'src/app/core/models/enum/enum.model';
import { CsvUploadButtonComponent } from "../../input/csv-upload-button/csv-upload-button.component";
import { CsvUploadDialogComponent } from '../../dialog/csv-upload-dialog/csv-upload-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { CSVImportAttributesService } from 'src/app/core/models/db/csv-import-attributes.model';
import { UploadedCSVFile } from 'src/app/core/models/misc/configuration-csv-import-field.model';

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

  @Input({ required: true }) uploadData!: CSVImportAttributesService['importAttributes'];

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
    this.ref = this.dialogService.open(CsvUploadDialogComponent, {
      showHeader: false,
      data: {
        attributeType: this.attributeType,
        articleLink: this.articleLink,
        uploadData: this.uploadData,
        videoURL: this.videoURL
      }
    });

    this.ref.onClose.subscribe((file: UploadedCSVFile | undefined) => {
      if (file?.name) {
        // Dialog was closed with a filename (successful upload)
        this.fileName = file.name;
        this.fileNameChange.emit(file.name);
      }
    });
  }

}
