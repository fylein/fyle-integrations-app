import { LowerCasePipe } from '@angular/common';
import { Component, Host, Input, OnInit, Optional } from '@angular/core';
import { FormGroupDirective, ControlContainer, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
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
export class ConfigurationCsvImportFieldComponent implements OnInit {

  @Input({ required: true }) formGroupName: string;

  @Input({ required: true }) isMandatory: boolean;

  @Input() fieldNumber: number;

  @Input({ required: true }) label: string;

  @Input() subLabel: string;

  @Input() sourceField: Sage50FyleField;

  @Input() destinationField: Sage50ImportableField;

  @Input() appName: string;

  @Input({ required: true }) isImportCodeEditable: boolean;


  readonly brandingConfig = brandingConfig;

  readonly importFormatOptions = [
    {
      label: this.translocoService.translate('configurationCsvImportField.importNamesOnlyLabel'),
      subLabel: this.translocoService.translate('configurationCsvImportField.importNamesOnlySubLabel'),
      value: false
    },
    {
      label: this.translocoService.translate('configurationCsvImportField.importCodesAndNamesLabel'),
      subLabel: this.translocoService.translate('configurationCsvImportField.importCodesAndNamesSubLabel'),
      value: true
    }
  ];

  csvImportForm!: FormGroup;

  get dimension() {
    return sage50AttributeDisplayNames[this.destinationField];
  }

  constructor(
    private translocoService: TranslocoService,
    private formGroupDirective: FormGroupDirective
  ) {}

  handleReuploadClick() {

  }

  ngOnInit(): void {
    this.csvImportForm = this.formGroupDirective.form.get(this.formGroupName) as FormGroup;
  }

}
