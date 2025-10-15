import { CommonModule, LowerCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroupDirective, ControlContainer, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { CSVImportAttributesService } from 'src/app/core/models/db/csv-import-attributes.model';
import { sage50AttributeDisplayNames } from 'src/app/core/models/sage50/sage50-configuration/attribute-display-names';
import { Sage50FyleField, Sage50ImportableField } from 'src/app/core/models/sage50/sage50-configuration/sage50-import-settings.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { CsvUploadDialogComponent } from '../../dialog/csv-upload-dialog/csv-upload-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CSVImportFieldForm, CSVImportFieldFormWithMapping, CSVImportSourceFieldOption, UploadedCSVFile } from 'src/app/core/models/misc/configuration-csv-import-field.model';
import { Router } from '@angular/router';
import { CsvUploadButtonComponent } from "../../input/csv-upload-button/csv-upload-button.component";
import { pairwise, startWith } from 'rxjs';

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

  @Input() sourceFieldOptions: CSVImportSourceFieldOption[];

  @Output() addSourceFieldOption = new EventEmitter<CSVImportSourceFieldOption>();

  @Input() destinationField: Sage50ImportableField;

  @Input() appDisplayName: string;

  @Input() infoText: string;

  @Input() appResourceKey: keyof typeof brandingKbArticles.postOnboardingArticles;

  @Input() hasBeenImported: boolean;

  @Input() isSubfield: boolean = false;

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

  public csvImportForm!: FormGroup<CSVImportFieldForm | CSVImportFieldFormWithMapping>;

  public customFieldForm = new FormGroup({
    attribute_type: new FormControl('', Validators.required),
    display_name: new FormControl(''),
    source_placeholder: new FormControl('', Validators.required)
  });

  public showCustomFieldDialog = false;

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

  get isSourceFieldEditable() {
    return this.sourceFieldOptions?.length > 0;
  }

  get isUploadDisabled() {
    return this.isSourceFieldEditable && !this.csvImportForm?.get('sourceField')?.value;
  }


  constructor(
    private translocoService: TranslocoService,
    private formGroupDirective: FormGroupDirective,
    private dialogService: DialogService,
    private router: Router,
    private cdr: ChangeDetectorRef
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

  handleCustomFieldSave() {
    const rawFieldName = this.customFieldForm.get('attribute_type')?.value;
    const fieldName = rawFieldName?.split(' ')?.join('_')?.toUpperCase();
    const placeholder = this.customFieldForm.get('source_placeholder')?.value;

    // Add the new option to the global sourceFieldOptions
    this.addSourceFieldOption.emit({
      label: rawFieldName ?? '',
      value: fieldName ?? null,
      placeholder: placeholder ?? null
    });

    // Set the new values to the csvImportForm
    this.csvImportForm?.get('sourceField')?.patchValue(fieldName ?? null);
    this.csvImportForm?.get('sourcePlaceholder')?.patchValue(placeholder ?? null);
    this.showCustomFieldDialog = false;
  }

  closeModel() {
    this.showCustomFieldDialog = false;
    this.customFieldForm.reset();
  }

  private setupWatchers(): void {
    if (!this.csvImportForm?.get('sourceField')) {
      return;
    }
    const sourceFieldControl = (this.csvImportForm as FormGroup<CSVImportFieldFormWithMapping>).get('sourceField');
    sourceFieldControl?.valueChanges
      .pipe(
        startWith(this.csvImportForm?.get('sourceField')?.value),
        pairwise()
      )
      .subscribe(([previousValue, currentValue]) => {
        if (currentValue === 'custom_field') {
          // Hack to get primeNG dropdown to update
          setTimeout(() => {
            this.csvImportForm?.get('sourceField')?.patchValue(previousValue ?? null);
            this.cdr.detectChanges();
          }, 0);
          this.customFieldForm.reset();
          this.showCustomFieldDialog = true;
        }
        // Update the source placeholder along with source field updates
        const currentOption = this.sourceFieldOptions.find(option => option.value === currentValue);
        this.csvImportForm?.get('sourcePlaceholder')?.patchValue(currentOption?.placeholder ?? null);
      });
  }

  ngOnInit(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.csvImportForm = this.formGroupDirective.form.get(this.formGroupName) as FormGroup;
    this.setupWatchers();
  }

}
