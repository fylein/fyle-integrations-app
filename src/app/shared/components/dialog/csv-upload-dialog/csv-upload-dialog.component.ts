import { Component, OnInit } from '@angular/core';
import { Sage50AttributeType, ButtonType, ButtonSize, ToastSeverity } from 'src/app/core/models/enum/enum.model';
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
import { CSVImportAttributesInvalidResponse, CSVImportAttributesService, CSVImportAttributesValidResponse } from 'src/app/core/models/db/csv-import-attributes.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { downloadCSVFile } from 'src/app/core/util/downloadFile';

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
    videoURL: string,
    uploadData: CSVImportAttributesService['importAttributes']
  };

  displayName: string;

  safeVideoURL: SafeResourceUrl;

  state: 'PROMPT' | 'UPLOADING' | 'ERROR' = 'PROMPT';

  private csv: {
    name: string;
    data: string;
  };

  constructor(
    public config: DynamicDialogConfig,
    public dialogRef: DynamicDialogRef,
    private sanitizer: DomSanitizer,
    private csvJsonTranslator: CsvJsonTranslatorService,
    private toastService: IntegrationsToastService,
    public dialogService: DialogService,
    public translocoService: TranslocoService
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  showErrorDialog(error: CSVError) {
    const messageMap: Record<CSVErrorName, string> = {
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

    this.csvJsonTranslator.csvToJson(file, { rowLimit: 20_000 })
      // On CSV parse success, upload data and show loader
      .subscribe({
        next: (jsonData) => {
          this.state = 'UPLOADING';
          this.data.uploadData(this.data.attributeType, file.name, jsonData).subscribe({
            // On upload success
            next: (response: CSVImportAttributesValidResponse) => {
              this.dialogRef.close(response.file_name);
              this.toastService.displayToastMessage(
                ToastSeverity.SUCCESS,
                this.translocoService.translate(
                  'csvUploadDialog.uploadSuccess', { dimension: this.displayName }
                )
              );
            },
            error: (httpErrorResponse: { error: CSVImportAttributesInvalidResponse }) => {
              const response = httpErrorResponse?.error;
              if (response?.errors?.length) {
                // On validation fail, save csv contents, then show download button
                this.csv = {
                  name: `UPDATE_${file.name}`,
                  data: this.csvJsonTranslator.jsonToCsv(response.errors)
                };
                console.error('CSV upload - validation errors:', response.errors);
                this.state = 'ERROR';
              } else {
                // On other non-ok responses (such as 5xx), show error toast and close dialog
                this.toastService.displayToastMessage(
                  ToastSeverity.ERROR,
                  this.translocoService.translate('csvUploadDialog.uploadError')
                );
                console.error('CSV upload - unexpected error:', response);
                this.dialogRef.close();
              }
            }
          });
        },
        // On CSV parse fail, show error dialog and stay on the PROMPT state
        error: (error) => {
          console.error('CSV processing error:', error);
          if (error instanceof CSVError) {
            this.showErrorDialog(error);
          }
        }
      });
  }

  downloadErrorLog(): void {
    downloadCSVFile(this.csv.data, this.csv.name);
  }

  ngOnInit(): void {
    this.data = this.config.data;
    this.displayName = sage50AttributeDisplayNames[this.data.attributeType];
    this.safeVideoURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.videoURL);
  }
}
