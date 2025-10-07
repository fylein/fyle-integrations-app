import { LowerCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroupDirective, ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { brandingConfig } from 'src/app/branding/branding-config';
import { sage50AttributeDisplayNames } from 'src/app/core/models/sage50/sage50-configuration/attribute-display-names';
import { Sage50FyleField, Sage50ImportableCOAType, Sage50ImportableField } from 'src/app/core/models/sage50/sage50-configuration/sage50-import-settings.model';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-configuration-csv-import-field',
  standalone: true,
  imports: [ReactiveFormsModule, SharedModule, LowerCasePipe],
  templateUrl: './configuration-csv-import-field.component.html',
  styleUrl: './configuration-csv-import-field.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ConfigurationCsvImportFieldComponent {

  readonly brandingConfig = brandingConfig;

  @Input({ required: true }) isMandatory: boolean;

  @Input() fieldNumber: number;

  @Input({ required: true }) label: string;

  @Input() subLabel: string;

  @Input() sourceField: Sage50FyleField;

  @Input() destinationField: Sage50ImportableField;

  @Input() appName: string;

  get dimension() {
    return sage50AttributeDisplayNames[this.destinationField];
  }

}
