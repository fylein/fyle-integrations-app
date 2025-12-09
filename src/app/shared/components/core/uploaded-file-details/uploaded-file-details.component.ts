import { Component, Input, OnInit } from '@angular/core';
import { UploadedCSVFile } from 'src/app/core/models/misc/configuration-csv-import-field.model';
import { ButtonSize, ButtonType } from 'src/app/core/models/enum/enum.model';
import { EventEmitter, Output } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';

@Component({
  selector: 'app-uploaded-file-details',
  templateUrl: './uploaded-file-details.component.html',
  styleUrl: './uploaded-file-details.component.scss',
  standalone: false,
})
export class UploadedFileDetailsComponent implements OnInit {
  @Input({ required: true }) file: UploadedCSVFile;

  @Input({ required: true }) dimension: string;

  @Input() isOnboarding: boolean = false;

  @Output() reuploadClick: EventEmitter<void> = new EventEmitter<void>();

  readonly ButtonType = ButtonType;

  readonly ButtonSize = ButtonSize;

  public tooltipText?: string;

  constructor(public translocoService: TranslocoService) {}

  ngOnInit(): void {
    if (this.isOnboarding) {
      this.tooltipText = this.translocoService.translate('uploadedFileDetails.reuploadTooltip', {
        dimension: new SentenceCasePipe(this.translocoService).transform(this.dimension),
      });
    }
  }
}
