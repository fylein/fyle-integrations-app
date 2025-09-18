import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { Sage300SharedModule } from "src/app/integrations/sage300/sage300-shared/sage300-shared.module";
import { ButtonSize, ButtonType } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-configuration-csv-upload-field',
  standalone: true,
  imports: [TranslocoModule, Sage300SharedModule],
  templateUrl: './configuration-csv-upload-field.component.html',
  styleUrl: './configuration-csv-upload-field.component.scss'
})
export class ConfigurationCsvUploadFieldComponent {

  @Input({ required: true }) attributeType!: string;

  @Input({ required: true }) label!: string;

  @Input({ required: true }) subLabel!: string;

  @Input() fileName?: string;

  @Output() fileNameChange = new EventEmitter<string>();

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

}
