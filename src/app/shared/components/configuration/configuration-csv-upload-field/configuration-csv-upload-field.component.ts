import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ButtonSize, ButtonType, ClickEvent, Sage50AttributeType, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { CsvUploadButtonComponent } from "../../input/csv-upload-button/csv-upload-button.component";
import { CsvUploadDialogComponent } from '../../dialog/csv-upload-dialog/csv-upload-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { CSVAppName, CSVImportAttributesService } from 'src/app/core/models/db/csv-import-attributes.model';
import { UploadedCSVFile } from 'src/app/core/models/misc/configuration-csv-import-field.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { brandingDemoVideoLinks } from 'src/app/branding/branding-config';

@Component({
    selector: 'app-configuration-csv-upload-field',
    imports: [TranslocoModule, SharedModule, CsvUploadButtonComponent],
    providers: [DialogService],
    templateUrl: './configuration-csv-upload-field.component.html',
    styleUrl: './configuration-csv-upload-field.component.scss'
})
export class ConfigurationCsvUploadFieldComponent<A extends CSVAppName> {

  @Input({ required: true }) appResourceKey: A;

  @Input({ required: true }) attributeType!: Sage50AttributeType;

  @Input({ required: true }) label!: string;

  @Input({ required: true }) subLabel!: string;

  @Input({ required: true }) uploadData!: CSVImportAttributesService<A>['importAttributes'];

  @Input() articleLink!: string;

  @Input() videoURL!: string;

  @Input() fileName: string | null = null;

  @Input() isFieldMandatory: boolean = false;

  @Output() fileNameChange = new EventEmitter<string | null>();

  readonly ButtonType = ButtonType;

  readonly ButtonSize = ButtonSize;

  ref?: DynamicDialogRef | null;

  constructor(
    public dialogService: DialogService,
    public translocoService: TranslocoService,
    private trackingService: TrackingService
  ) { }

  handleUploadClick() {
    this.trackingService.onClickEvent(TrackingApp.SAGE50, ClickEvent.UPLOAD_CSV, {field: this.attributeType});
    this.ref = this.dialogService.open(CsvUploadDialogComponent, {
      showHeader: false,
      data: {
        appResourceKey: this.appResourceKey,
        attributeType: this.attributeType,
        articleLink: this.articleLink,
        uploadData: this.uploadData,
        videoURL: this.videoURL
      }
    });

    this.ref?.onClose.subscribe((file: UploadedCSVFile | undefined) => {
      if (file?.name) {
        // Dialog was closed with a filename (successful upload)
        this.fileName = file.name;
        this.fileNameChange.emit(file.name);
      }
    });
  }

}
