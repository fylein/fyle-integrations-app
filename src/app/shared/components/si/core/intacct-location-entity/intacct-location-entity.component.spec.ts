import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IntacctLocationEntityComponent } from './intacct-location-entity.component';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { StorageService } from 'src/app/core/services/core/storage.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { IntacctField } from 'src/app/core/models/enum/enum.model';
import { TrimCharacterPipe } from 'src/app/shared/pipes/trim-character.pipe';

describe('IntacctLocationEntityComponent', () => {
  let component: IntacctLocationEntityComponent;
  let fixture: ComponentFixture<IntacctLocationEntityComponent>;

  const mockRouter = {
    url: '/integrations/intacct/onboarding/export_settings'
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntacctLocationEntityComponent, TrimCharacterPipe],
      imports: [ReactiveFormsModule], // Add ReactiveFormsModule
      providers: [
        FormBuilder,
        { provide: SiMappingsService, useValue: { getSageIntacctDestinationAttributes: () => of([]) } },
        { provide: IntacctConnectorService, useValue: { getLocationEntityMapping: () => of({
          location_entity_name: 'TestName',
          country_name: 'TestCountry',
          destination_id: 'test',
          workspace: 123
        }) } },
        { provide: AuthService, useValue: {} },
        { provide: UserService, useValue: { getUserProfile: () => ({ org_name: 'TestOrg' }) } },
        { provide: StorageService, useValue: { get: () => 'workspaceId' } },
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: mockRouter },
        { provide: SiWorkspaceService, useValue: {} },
        { provide: IntegrationsToastService, useValue: {} },
        { provide: TrackingService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IntacctLocationEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize the page and setup location entity mapping', () => {
    // Getting the dependencies from TestBed to create spies
    const mappingsService = TestBed.inject(SiMappingsService);
    const connectorService = TestBed.inject(IntacctConnectorService);

    // Creating spies to simulate the behavior of the private methods
    spyOn(mappingsService, 'getSageIntacctDestinationAttributes').and.returnValue(of([]));
    spyOn(connectorService, 'getLocationEntityMapping').and.returnValue(of({
      location_entity_name: 'TestName',
      country_name: 'TestCountry',
      destination_id: 'test',
      workspace: 123
    }));

    // Calling ngOnInit to trigger the setupPage method and the private methods inside it
    component.ngOnInit();

    // Expectations to verify that the private methods are triggered correctly
    expect(mappingsService.getSageIntacctDestinationAttributes).toHaveBeenCalledWith(IntacctField.LOCATION_ENTITY);
    expect(connectorService.getLocationEntityMapping).toHaveBeenCalled();
  });

  it('should handle error in setup location entity mapping', () => {
    // Getting the dependencies from TestBed to create spies
    const connectorService = TestBed.inject(IntacctConnectorService);

    // Creating spies to simulate an error scenario
    spyOn(connectorService, 'getLocationEntityMapping').and.returnValue(throwError('error'));

    // Calling ngOnInit to trigger the setupPage method and the private methods inside it
    component.ngOnInit();

    // Expectations to verify that the private methods are triggered correctly
    expect(connectorService.getLocationEntityMapping).toHaveBeenCalled();
  });

});
