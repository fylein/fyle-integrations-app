import { CommonModule, LowerCasePipe } from '@angular/common';
import { Component, Host, Input, OnInit, Optional } from '@angular/core';
import { FormGroupDirective, ControlContainer, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { CSVImportAttributesService } from 'src/app/core/models/db/csv-import-attributes.model';
import { sage50AttributeDisplayNames } from 'src/app/core/models/sage50/sage50-configuration/attribute-display-names';
import { Sage50FyleField, Sage50ImportableCOAType, Sage50ImportableField } from 'src/app/core/models/sage50/sage50-configuration/sage50-import-settings.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { CsvUploadDialogComponent } from '../../dialog/csv-upload-dialog/csv-upload-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CSVImportFieldForm, UploadedCSVFile } from 'src/app/core/models/misc/configuration-csv-import-field.model';
import { Router } from '@angular/router';
import { CsvUploadButtonComponent } from "../../input/csv-upload-button/csv-upload-button.component";

@Component({
  selector: 'app-configuration-csv-import-field',
  standalone: true,
  imports: [ReactiveFormsModule, SharedModule, LowerCasePipe, CsvUploadButtonComponent, CommonModule],
  templateUrl: './configuration-csv-import-field.component.html',
  styleUrl: './configuration-csv-import-field.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  providers: [DialogService]
})
export class ConfigurationCsvImportFieldComponent implements OnInit {

  @Input({ required: true }) formGroupName: string;

  @Input({ required: true }) isMandatory: boolean;

  @Input() fieldNumber: number;

  @Input({ required: true }) label: string;

  @Input() subLabel: string;

  @Input() sourceField: Sage50FyleField;

  @Input() sourceFieldOptions: { label: string, value: Sage50FyleField | 'custom_field' }[];

  @Input() destinationField: Sage50ImportableField;

  @Input() appDisplayName: string;

  @Input() appResourceKey: keyof typeof brandingKbArticles.postOnboardingArticles;

  @Input() hasBeenImported: boolean;

  @Input() uploadData: CSVImportAttributesService['importAttributes'];

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

  public csvImportForm!: FormGroup<CSVImportFieldForm>;

  public isOnboarding: boolean;

  get dimension() {
    return sage50AttributeDisplayNames[this.destinationField];
  }

  get isEnabled() {
    return this.csvImportForm?.get('enabled')?.value ?? false;
  }

  get uploadedFile() {
    return this.csvImportForm?.get('file')?.value ?? null;
  }


  constructor(
    private translocoService: TranslocoService,
    private formGroupDirective: FormGroupDirective,
    private dialogService: DialogService,
    private router: Router
  ) {}

  handleUploadClick() {
    const ref = this.dialogService.open(CsvUploadDialogComponent, {
      showHeader: false,
      data: {
        attributeType: this.destinationField,
        articleLink: brandingKbArticles.postOnboardingArticles[this.appResourceKey][this.destinationField],
        uploadData: this.uploadData,
        videoURL: brandingDemoVideoLinks.postOnboarding[this.appResourceKey][this.destinationField]
      }
    });

    ref.onClose.subscribe((file?: UploadedCSVFile) => {
      if (file?.name) {
        if (this.isOnboarding) {
          // During onboarding, update the 'Values ready to import' field
          this.csvImportForm?.get('file')?.patchValue({
            name: file.name,
            valueCount: file.valueCount ?? 0,
            lastUploadedAt: file.lastUploadedAt ?? new Date()
          });
        } else {
          // Post onboarding, don't update the 'Mapped values' field
          const currentFile = this.csvImportForm?.get('file')?.value;
          this.csvImportForm?.get('file')?.patchValue({
            name: file.name,
            valueCount: currentFile?.valueCount ?? 0,
            lastUploadedAt: file.lastUploadedAt ?? new Date()
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.csvImportForm = this.formGroupDirective.form.get(this.formGroupName) as FormGroup;
  }

}
