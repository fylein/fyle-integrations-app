import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationCta, RedirectLink } from 'src/app/core/models/enum/enum.model';
import { LocationEntityMapping } from 'src/app/core/models/si/db/location-entity-mapping.model';
import { MappingDestination } from 'src/app/core/models/si/db/mapping-destination.mode';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorageService } from 'src/app/core/services/core/storage.service';

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

  fyleOrgName: string = this.userService.getUserProfile().org_name;

  constructor(private formBuilder: FormBuilder,
    private mappingsService: SiMappingsService,
    private authService: AuthService,
    private userService: UserService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router) { }


    switchFyleOrg(): void {
      this.authService.logout();
    }

    submit() {

      const locationEntityId = this.locationEntityForm.value.siLocationEntities;
      console.log('submitted');
      let locationEntityMappingPayload;

      if (this.locationEntityForm.value.siLocationEntities !== 'top_level') {
        const siEntityMapping = this.siLocationEntities.filter(filteredLocationEntity => filteredLocationEntity.destination_id === locationEntityId)[0];
        locationEntityMappingPayload = {
          location_entity_name: siEntityMapping.value,
          destination_id: siEntityMapping.destination_id,
          country_name: siEntityMapping.detail.country,
          workspace: this.workspaceId
        };
      } else {
        locationEntityMappingPayload = {
          location_entity_name: 'Top Level',
          destination_id: 'top_level',
          country_name: null,
          workspace: this.workspaceId
        };
      }
      this.isLoading = true;

      this.mappingsService.postLocationEntityMapping(locationEntityMappingPayload).subscribe(() => {

      });
    }

    getlocationEntityMappings() {
      this.mappingsService.getLocationEntityMapping().subscribe(locationEntityMappings => {
        this.isLoading = false;
        this.locationEntityMappings = locationEntityMappings;
        this.locationEntityMappingDone = true;
        this.locationEntityForm = this.formBuilder.group({
          siLocationEntities: [this.locationEntityMappings ? this.locationEntityMappings.destination_id : '']
        });
        this.locationEntityForm.controls.siLocationEntities.disable();
      }, () => {
        this.isLoading = false;
        this.locationEntityForm = this.formBuilder.group({
          siLocationEntities: ['', Validators.required]
        });
      });
    }

    setupLocationEntity() {
      this.workspaceId = this.storageService.get('si.workspaceId');
      this.isLoading = false;
      this.mappingsService.getSageIntacctDestinationAttributes('LOCATION_ENTITY').subscribe((locationEntities) => {
        this.siLocationEntities = locationEntities;
        this.getlocationEntityMappings();
      });
      
    }

  ngOnInit(): void {
    this.setupLocationEntity();
  }

}
