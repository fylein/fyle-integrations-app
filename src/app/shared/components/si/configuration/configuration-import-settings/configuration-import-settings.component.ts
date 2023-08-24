import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ConfigurationCta, RedirectLink } from 'src/app/core/models/enum/enum.model';
import { ExpenseField } from 'src/app/core/models/si/misc/expense-field.model';
import { ImportSettingGet } from 'src/app/core/models/si/si-configuration/import-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiImportSettingService } from 'src/app/core/services/si/si-configuration/si-import-setting.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-configuration-import-settings',
  templateUrl: './configuration-import-settings.component.html',
  styleUrls: ['./configuration-import-settings.component.scss']
})
export class ConfigurationImportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  importSettingsForm: FormGroup;

  expenseFields: FormArray;

  RedirectLink = RedirectLink;

  saveInProgress: boolean = false;

  isOnboarding: boolean;

  ConfigurationCtaText = ConfigurationCta;

  importSettings: ImportSettingGet;

  sageIntacctTaxGroup: DestinationAttribute[];

  sageIntacctFields: ExpenseField[];

  fyleFields: ExpenseField[];

  showAddButton: boolean;

  constructor(
    private router: Router,
    private mappingService: SiMappingsService,
    private importSettingService: SiImportSettingService,
    private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: SiWorkspaceService
  ) { }

  get expenseFieldsGetter() {
    return this.importSettingsForm.get('expenseFields') as FormArray;
  }

  createExpenseField(sourceField: string = '', destinationField: string = '', isCustom: boolean = false, importToFyle: boolean = false, parentField: string = '') {
    const formControllers = {
      source_field: [sourceField ? sourceField : '', [Validators.required]],
      destination_field: [destinationField ? destinationField : '', [Validators.required]],
      import_to_fyle: [importToFyle],
      is_custom: [isCustom]
    };

    const group = this.formBuilder.group(formControllers);

    return group;
  }

  showOrHideAddButton() {
    if (this.importSettingsForm.controls.expenseFields.value.length === this.sageIntacctFields.length) {
      return false;
    }
    return true;
  }

  addExpenseField() {
    this.expenseFields = this.importSettingsForm.get('expenseFields') as FormArray;
    this.expenseFields.push(this.createExpenseField());
    this.showAddButton = this.showOrHideAddButton();
  }

  removeExpenseField(index: number, sourceField: string) {

    const expenseFields = this.importSettingsForm.get('expenseFields') as FormArray;
    expenseFields.removeAt(index);

    // Remove custom field option from the Fyle fields drop down if the corresponding row is deleted
    if (sourceField && sourceField !== 'PROJECT' && sourceField !== 'COST_CENTER') {
      this.fyleFields = this.fyleFields.filter(mappingRow => mappingRow.attribute_type !== sourceField);
    }
    this.showAddButton = this.showOrHideAddButton();
  }


  private importSettingWatcher(): void {
    this.importSettingsForm?.controls?.importTaxCodes?.valueChanges.subscribe((isImportTaxEnabled) => {
      if (!isImportTaxEnabled) {
        this.importSettingsForm?.controls?.sageIntacctTaxCodes?.setValue(null);
      }
    });
  }

  private getSettingsAndSetupForm(): void {
    const destinationAttributes = ['TAX_DETAIL'];

    const sageIntacctFieldsObservable = this.mappingService.getSageIntacctFields();
    const fyleFieldsObservable = this.mappingService.getFyleFields();
    const groupedAttributesObservable = this.mappingService.getGroupedDestinationAttributes(destinationAttributes);
    const importSettingsObservable = this.importSettingService.getImportSettings();

    forkJoin([
      sageIntacctFieldsObservable,
      fyleFieldsObservable,
      groupedAttributesObservable,
      importSettingsObservable
    ]).subscribe(
      ([sageIntacctFields, fyleFields, groupedAttributesResponse, importSettings]) => {
        this.sageIntacctFields = sageIntacctFields;
        this.fyleFields = fyleFields;
        this.sageIntacctTaxGroup = groupedAttributesResponse.TAX_DETAIL;

        this.importSettings = importSettings;

        const expenseFieldFormArray: FormGroup[] = [this.createExpenseField()];

        this.importSettingsForm = this.formBuilder.group({
          importVendorAsMerchant: [importSettings.configurations.import_vendors_as_merchants || null],
          importCategories: [importSettings.configurations.import_categories || null],
          importTaxCodes: [importSettings.configurations.import_tax_codes || null],
          sageIntacctTaxCodes: [(this.sageIntacctTaxGroup?.find(taxGroup => taxGroup.id.toString() === this.importSettings?.general_mappings?.default_tax_code.id)) || null],
          expenseFields: this.formBuilder.array(expenseFieldFormArray)
        });

        this.isLoading = false;
        this.importSettingWatcher();
      }
    );
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
