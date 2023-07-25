import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationCta, RedirectLink } from 'src/app/core/models/enum/enum.model';
import { LocationEntityMapping } from 'src/app/core/models/si/db/location-entity-mapping.model';
import { MappingDestination } from 'src/app/core/models/si/db/mapping-destination.mode';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';

@Component({
  selector: 'app-intacct-location-entity',
  templateUrl: './intacct-location-entity.component.html',
  styleUrls: ['./intacct-location-entity.component.scss']
})
export class IntacctLocationEntityComponent implements OnInit {

  locationEntityForm: FormGroup;

  siLocationEntities: MappingDestination[];

  locationEntityMappings: LocationEntityMapping;
  
  locationEntityMappingDone = false;

  isLoading: boolean;

  isSaveDisabled: boolean;

  locationEntity: boolean = false;

  workspaceId: number;

  ConfigurationCtaText = ConfigurationCta;

  isOnboarding: boolean = true;

  saveInProgress: boolean = false;

  redirectLink: RedirectLink.INTACCT;

  constructor(private formBuilder: FormBuilder,
    private mappingsService: SiMappingsService,
    private route: ActivatedRoute,
    private router: Router) { }

  
    submit() {
      const that = this;
  
      const locationEntityId = that.locationEntityForm.value.siLocationEntities;
  
      let locationEntityMappingPayload;
  
      if (that.locationEntityForm.value.siLocationEntities !== 'top_level') {
        const siEntityMapping = that.siLocationEntities.filter(filteredLocationEntity => filteredLocationEntity.destination_id === locationEntityId)[0];
        locationEntityMappingPayload = {
          location_entity_name: siEntityMapping.value,
          destination_id: siEntityMapping.destination_id,
          country_name: siEntityMapping.detail.country,
          workspace: that.workspaceId
        };
      } else {
        locationEntityMappingPayload = {
          location_entity_name: 'Top Level',
          destination_id: 'top_level',
          country_name: null,
          workspace: that.workspaceId
        };
      }
      that.isLoading = true;
  
      that.mappingsService.postLocationEntityMapping(locationEntityMappingPayload).subscribe(() => {
        that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
      });
    }
  
    getlocationEntityMappings() {
      const that = this;
      that.mappingsService.getLocationEntityMapping().subscribe(locationEntityMappings => {
        that.isLoading = false;
        that.locationEntityMappings = locationEntityMappings;
        that.locationEntityMappingDone = true;
        that.locationEntityForm = that.formBuilder.group({
          siLocationEntities: [that.locationEntityMappings ? that.locationEntityMappings.destination_id : '']
        });
        that.locationEntityForm.controls.siLocationEntities.disable();
      }, () => {
        that.isLoading = false;
        that.locationEntityForm = that.formBuilder.group({
          siLocationEntities: ['', Validators.required]
        });
      });
    }

    setupLocationEntity() {
      const that = this;
      // that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
      that.isLoading = true;
      that.mappingsService.getSageIntacctDestinationAttributes('LOCATION_ENTITY').subscribe((locationEntities) => {
        that.siLocationEntities = locationEntities;
  
        that.getlocationEntityMappings();
      });
    }

  ngOnInit(): void {
    this.setupLocationEntity();
  }

}
