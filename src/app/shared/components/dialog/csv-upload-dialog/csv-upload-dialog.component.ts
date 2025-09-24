import { Component, OnInit } from '@angular/core';
import { Sage50AttributeType, ButtonType, ButtonSize } from 'src/app/core/models/enum/enum.model';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { sage50AttributeDisplayNames } from 'src/app/core/models/sage50/sage50-configuration/attribute-display-names';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { CsvJsonTranslatorService } from 'src/app/core/services/common/csv-json-translator.service';
import { CSVError, CSVErrorName } from 'src/app/core/models/common/csv-error.model';
import { TranslocoService } from '@jsverse/transloco';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { DynamicDialogComponent } from '../../core/dynamic-dialog/dynamic-dialog.component';

@Component({
  selector: 'app-csv-upload-dialog',
  standalone: true,
  imports: [SharedModule, FileUploadModule, DialogComponent],
  templateUrl: './csv-upload-dialog.component.html',
  styleUrl: './csv-upload-dialog.component.scss'
})
export class CsvUploadDialogComponent implements OnInit {

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly ButtonType = ButtonType;

  readonly ButtonSize = ButtonSize;

  data!: {
    attributeType: Sage50AttributeType,
    articleLink: string,
    videoURL: string
  };

  displayName: string;

  safeVideoURL: SafeResourceUrl;

  state: 'PROMPT' | 'UPLOADING' | 'ERROR' = 'PROMPT';

  constructor(
    public config: DynamicDialogConfig,
    public dialogRef: DynamicDialogRef,
    private sanitizer: DomSanitizer,
    private csvJsonTranslator: CsvJsonTranslatorService,
    public dialogService: DialogService,
    public translocoService: TranslocoService
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  showErrorDialog(error: CSVError) {
    const messageMap: Partial<Record<CSVErrorName, string>> = {
      MULTIPLE_FILES_PROVIDED: this.translocoService.translate('csvUploadDialog.onlyOneCsvAllowed'),
      FILE_IS_NOT_CSV: this.translocoService.translate('csvUploadDialog.fileIsNotCsv'),
      ROW_LIMIT_EXCEEDED: this.translocoService.translate('csvUploadDialog.rowLimitExceeded')
    };
    this.dialogService.open(DynamicDialogComponent, {
      showHeader: false,
      data: {
        type: 'ERROR',
        header: this.translocoService.translate('csvUploadDialog.errorDialogHeader'),
        message: messageMap[error.name],
        buttonText: this.translocoService.translate('csvUploadDialog.errorDialogButtonText')
      }
    });
  }

  handleFileSelect(event: FileSelectEvent): void {
    event.originalEvent.preventDefault();

    const file = event.files[0];
    if (!file) {
      return;
    }

    if (event.files.length > 1) {
      this.showErrorDialog(new CSVError(
        'MULTIPLE_FILES_PROVIDED', 'Only one file can be uploaded at a time.'
      ));
      return;
    }

    this.state = 'UPLOADING';

    this.csvJsonTranslator.csvToJson(file, { rowLimit: 20_000 })
      .subscribe({
        next: (jsonData) => {
          // TODO: Upload data, handle errors, show toast & close on success
        },
        error: (error) => {
          console.error('CSV processing error:', error);
          if (error instanceof CSVError) {
            this.showErrorDialog(error);
          }
        }
      });
  }

  downloadErrorLog(): void {
  }

  ngOnInit(): void {
    this.data = this.config.data;
    this.displayName = sage50AttributeDisplayNames[this.data.attributeType];
    this.safeVideoURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.videoURL);
  }
}
