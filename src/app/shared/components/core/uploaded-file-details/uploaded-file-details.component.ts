import { Component, Input } from '@angular/core';
import { UploadedCSVFile } from 'src/app/core/models/misc/configuration-csv-import-field.model';
import { ButtonSize, ButtonType } from 'src/app/core/models/enum/enum.model';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-uploaded-file-details',
  templateUrl: './uploaded-file-details.component.html',
  styleUrl: './uploaded-file-details.component.scss'
})
export class UploadedFileDetailsComponent {

  @Input({ required: true }) file: UploadedCSVFile;

  @Input({ required: true }) dimension: string;

  @Input() isOnboarding: boolean = false;

  @Output() reuploadClick: EventEmitter<void> = new EventEmitter<void>();

  readonly ButtonType = ButtonType;

  readonly ButtonSize = ButtonSize;
}
