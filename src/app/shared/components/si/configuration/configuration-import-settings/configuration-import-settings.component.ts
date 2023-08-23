import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ConfigurationCta, RedirectLink } from 'src/app/core/models/enum/enum.model';
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

  RedirectLink = RedirectLink;

  saveInProgress: boolean = false;

  isOnboarding: boolean;

  ConfigurationCtaText = ConfigurationCta;

  importSettings: ImportSettingGet;

  sageIntacctTaxGroup: DestinationAttribute[];

  constructor(
    private router: Router,
    private mappingService: SiMappingsService,
    private importSettingService: SiImportSettingService,
    private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: SiWorkspaceService
  ) { }


  private importSettingWatcher(): void {
    this.importSettingsForm?.controls?.importTaxCodes?.valueChanges.subscribe((isImportTaxEnabled) => {
      if(!isImportTaxEnabled) {
        this.importSettingsForm?.controls?.sageIntacctTaxCodes?.setValue(null);
      }
    });
  }

  private getSettingsAndSetupForm(): void {
    const destinationAttributes = ['TAX_DETAIL'];

    const groupedAttributesObservable = this.mappingService.getGroupedDestinationAttributes(destinationAttributes);
    const importSettingsObservable = this.importSettingService.getImportSettings();

    forkJoin([groupedAttributesObservable, importSettingsObservable]).subscribe(
      ([groupedAttributesResponse, importSettings]) => {
        this.sageIntacctTaxGroup = groupedAttributesResponse.TAX_DETAIL;

        this.importSettings = importSettings;

        this.importSettingsForm = this.formBuilder.group({
          importVendorAsMerchant: [importSettings.configurations.import_vendors_as_merchants || null],
          importCategories: [importSettings.configurations.import_categories || null],
          importTaxCodes: [importSettings.configurations.import_tax_codes || null],
          sageIntacctTaxCodes: [(this.sageIntacctTaxGroup?.find(taxGroup => taxGroup.id.toString() === this.importSettings?.general_mappings?.default_tax_code.id)) || null],
        });

        this.isLoading = false;
        this.importSettingWatcher();
      });
  }
  

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
