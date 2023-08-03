import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationCta, IntacctOnboardingState, RedirectLink, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { LocationEntityMapping } from 'src/app/core/models/si/db/location-entity-mapping.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';
import { StorageService } from 'src/app/core/services/core/storage.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { ConnectionPOST } from 'src/app/core/models/si/si-configuration/connector.model';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';

@Component({
  selector: 'app-intacct-location-entity',
  templateUrl: './intacct-location-entity.component.html',
  styleUrls: ['./intacct-location-entity.component.scss']
})
export class IntacctLocationEntityComponent implements OnInit {

  locationEntityForm: FormGroup;
  locationEntityOptions: DestinationAttribute[];
  locationEntity: LocationEntityMapping;
  isLoading: boolean;
  isOnboarding: boolean = true;
  saveInProgress: boolean = false;
  workspaceId: number;
  ConfigurationCtaText = ConfigurationCta;
  redirectLink: string = RedirectLink.INTACCT;
  fyleOrgName: string = this.userService.getUserProfile().org_name;

  constructor(
    private formBuilder: FormBuilder,
    private mappingsService: SiMappingsService,
    private connectorService: IntacctConnectorService,
    private authService: AuthService,
    private userService: UserService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    private workspaceService: SiWorkspaceService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService
  ) { }

  save() {
    this.isLoading = true;
    this.saveInProgress = true;

    const locationEntityId = this.locationEntityForm.value.locationEntity;
    const locationEntityMappingPayload: ConnectionPOST = this.getLocationEntityMappingPayload(locationEntityId);

    this.connectorService.postLocationEntityMapping(locationEntityMappingPayload).subscribe(
      () => {
        this.handleSuccess(locationEntityMappingPayload);
        this.saveInProgress = false;
      },
      () => {
        this.isLoading = false;
        this.saveInProgress = false;
      }
    );
  }

  private getLocationEntityMappingPayload(locationEntityId: any): ConnectionPOST {
    if (locationEntityId.destination_id !== 'top_level') {
      const locationEntity = this.locationEntityOptions.filter(entity => entity.destination_id === locationEntityId.destination_id);
      return {
        location_entity_name: locationEntity[0].value,
        destination_id: locationEntity[0].destination_id,
        country_name: locationEntity[0].detail.country,
        workspace: this.workspaceId
      };
    } else {
      return {
        location_entity_name: 'Top Level',
        destination_id: 'top_level',
        country_name: null,
        workspace: this.workspaceId
      };
    }
  }

  private handleSuccess(locationEntityMappingPayload: ConnectionPOST): void {
    if (this.workspaceService.getIntacctOnboardingState() === IntacctOnboardingState.CONNECTION) {
      this.trackingService.integrationsOnboardingCompletion(IntacctOnboardingState.CONNECTION, 2, locationEntityMappingPayload);
    }

    if (this.isOnboarding) {
      this.workspaceService.setIntacctOnboardingState(IntacctOnboardingState.EXPORT_SETTINGS);
      this.router.navigate(['/integrations/intacct/onboarding/export_settings']);
    }

    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Location Entity Selected Successfully.');

    this.mappingsService.refreshSageIntacctDimensions(['location_entities']).subscribe(() => {
      this.isLoading = false;
    });
  }

  private setupLocationEntity() {
    this.workspaceId = this.storageService.get('si.workspaceId');
    this.mappingsService.getSageIntacctDestinationAttributes(IntacctOnboardingState.LOCATION_ENTITY).subscribe((locationEntities) => {
      this.locationEntityOptions = locationEntities;
      this.getlocationEntityMappings();
    });
  }

  private getlocationEntityMappings() {
    this.connectorService.getLocationEntityMapping().subscribe(locationEntityMappings => {
      this.locationEntity = locationEntityMappings;
      this.locationEntityForm = this.formBuilder.group({
        locationEntity: [this.locationEntity ? this.locationEntity : '']
      });
      this.locationEntityForm.controls.locationEntity.disable();
      this.isLoading = false;
    }, () => {
      this.locationEntityForm = this.formBuilder.group({
        locationEntity: ['', Validators.required]
      });
      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.setupLocationEntity();
  }
}
