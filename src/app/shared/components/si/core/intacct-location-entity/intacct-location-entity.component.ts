import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppName, ConfigurationCta, IntacctField, IntacctOnboardingState, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { LocationEntityMapping } from 'src/app/core/models/intacct/db/location-entity-mapping.model';
import { UserService } from 'src/app/core/services/misc/user.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { LocationEntityPost } from 'src/app/core/models/intacct/intacct-configuration/connector.model';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { IntacctDestinationAttribute } from 'src/app/core/models/intacct/db/destination-attribute.model';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-intacct-location-entity',
  templateUrl: './intacct-location-entity.component.html',
  styleUrls: ['./intacct-location-entity.component.scss']
})
export class IntacctLocationEntityComponent implements OnInit {

  locationEntityForm: FormGroup;

  locationEntityOptions: IntacctDestinationAttribute[];

  locationEntity: LocationEntityMapping;

  isLoading: boolean = true;

  isOnboarding: boolean;

  isRefreshDimensionInProgress: boolean;

  saveInProgress: boolean = false;

  workspaceId: number;

  appName: AppName = AppName.INTACCT;

  ConfigurationCtaText = ConfigurationCta;

  redirectLink: string = brandingKbArticles.onboardingArticles.INTACCT.CONNECTOR;

  fyleOrgName: string = this.userService.getUserProfile().org_name;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

  locationEntityLabel: string;

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private mappingsService: SiMappingsService,
    private connectorService: IntacctConnectorService,
    private userService: UserService,
    private storageService: StorageService,
    private router: Router,
    private workspaceService: SiWorkspaceService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private helperService: HelperService,
    private translocoService: TranslocoService
  ) { }

  patchFormValue(event: any): void {
    this.locationEntityForm.controls.locationEntity.patchValue(event.value);
  }

  save() {
    this.isLoading = true;
    this.saveInProgress = true;

    const locationEntityId = this.locationEntityForm.get('locationEntity')?.value;
    const locationEntityMappingPayload: LocationEntityPost = this.getLocationEntityMappingPayload(locationEntityId);

    this.connectorService.postLocationEntityMapping(locationEntityMappingPayload).subscribe(
      (locationEntity) => {
        this.locationEntity = locationEntity;
        this.isLoading = false;
        this.handleSuccess(locationEntityMappingPayload);
      },
      () => {
        this.isLoading = false;
        this.saveInProgress = false;
      }
    );
  }

  private getLocationEntityMappingPayload(locationEntityId: any): LocationEntityPost {
    if (locationEntityId.destination_id !== 'top_level') {
      const locationEntity = this.locationEntityOptions.filter(entity => entity.destination_id === locationEntityId.destination_id);
      return {
        location_entity_name: locationEntity[0].value,
        destination_id: locationEntity[0].destination_id,
        country_name: locationEntity[0].detail?.country ? locationEntity[0].detail.country : null,
        workspace: this.workspaceId
      };
    }
    return {
      location_entity_name: this.translocoService.translate('intacctLocationEntity.topLevel'),
      destination_id: 'top_level',
      country_name: null,
      workspace: this.workspaceId
    };
  }

  navigateToExportSetting() {
    this.router.navigate(['/integrations/intacct/onboarding/export_settings']);
  }

  private setOnboardingStateAndRedirect(locationEntityMappingPayload: LocationEntityPost): void {
    if (this.workspaceService.getIntacctOnboardingState() === IntacctOnboardingState.CONNECTION) {
      this.trackingService.integrationsOnboardingCompletion(TrackingApp.INTACCT, IntacctOnboardingState.CONNECTION, 2, locationEntityMappingPayload);
    }

    if (this.isOnboarding) {
      this.workspaceService.setIntacctOnboardingState(IntacctOnboardingState.EXPORT_SETTINGS);
      this.router.navigate(['/integrations/intacct/onboarding/export_settings']);
    }
    this.isLoading = false;
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('intacctLocationEntity.locationEntitySuccessToast'));
  }

  private handleSuccess(locationEntityMappingPayload: LocationEntityPost): void {
    this.isRefreshDimensionInProgress = true;

    this.mappingsService.refreshSageIntacctDimensions().subscribe();

    const fyleOrgId = this.storageService.get('org').fyle_org_id;
    this.helperService.pollDimensionsSyncStatus({
      onPollingComplete: () => {
        this.setOnboardingStateAndRedirect(locationEntityMappingPayload);
      },
      getWorkspacesObserver: () => this.workspaceService.getWorkspaceWithoutCache(fyleOrgId, true)
    });
  }

  private setupPage() {
    this.workspaceId = this.storageService.get('workspaceId');
    this.isOnboarding = this.router.url.includes('onboarding');
    this.mappingsService.getSageIntacctDestinationAttributes(IntacctField.LOCATION_ENTITY).subscribe((locationEntities) => {
      const topLevelOption = {
        id: 1,
        attribute_type: 'LOCATION_ENTITY',
        display_name: this.translocoService.translate('intacctLocationEntity.locationEntity'),
        destination_id: 'top_level',
        value: this.translocoService.translate('intacctLocationEntity.topLevel'),
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        workspace: this.workspaceId,
        detail: {}
      };

      // Only add top level option if there are multiple location entities
      this.locationEntityOptions = locationEntities.length > 1
        ? [topLevelOption].concat(locationEntities)
        : locationEntities;

      this.setupLocationEntityMapping();
    });
  }

  private setupLocationEntityMapping() {
    this.connectorService.getLocationEntityMapping().subscribe(locationEntityMappings => {
      this.locationEntity = locationEntityMappings;
      this.locationEntityForm = this.formBuilder.group({
        locationEntity: [this.locationEntity ? this.locationEntity : '']
      });
      this.locationEntityForm.controls.locationEntity.disable();
      this.isLoading = false;
    }, () => {
      this.locationEntityForm = this.formBuilder.group({
        locationEntity: [null, Validators.required]
      });
      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.locationEntityLabel = this.translocoService.translate('intacct.common.locationEntity');
    this.setupPage();
  }
}
