import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { Sage300SharedModule } from "src/app/integrations/sage300/sage300-shared/sage300-shared.module";
import { ButtonSize, ButtonType } from 'src/app/core/models/enum/enum.model';
import { CsvUploadButtonComponent } from "../../input/csv-upload-button/csv-upload-button.component";

@Component({
  selector: 'app-configuration-csv-upload-field',
  standalone: true,
  imports: [TranslocoModule, Sage300SharedModule, CsvUploadButtonComponent],
  templateUrl: './configuration-csv-upload-field.component.html',
  styleUrl: './configuration-csv-upload-field.component.scss'
})
export class ConfigurationCsvUploadFieldComponent {

  @Input({ required: true }) attributeType!: string;

  @Input({ required: true }) label!: string;

  @Input({ required: true }) subLabel!: string;

  @Input() fileName: string | null = null;

  @Output() fileNameChange = new EventEmitter<string | null>();

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

}
