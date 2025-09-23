import { Component, OnInit } from '@angular/core';
import { Sage50AttributeType, ButtonType, ButtonSize } from 'src/app/core/models/enum/enum.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { sage50AttributeDisplayNames } from 'src/app/core/models/sage50/sage50-configuration/attribute-display-names';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Sage300SharedModule } from "src/app/integrations/sage300/sage300-shared/sage300-shared.module";
import { brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-csv-upload-dialog',
  standalone: true,
  imports: [Sage300SharedModule, FileUploadModule],
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
    private sanitizer: DomSanitizer
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  handleFileSelect(event: FileSelectEvent) {
    event.originalEvent.preventDefault();
  }

  downloadErrorLog(): void {
  }

  ngOnInit(): void {
    this.data = this.config.data;
    this.displayName = sage50AttributeDisplayNames[this.data.attributeType];
    this.safeVideoURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.videoURL);
  }
}
