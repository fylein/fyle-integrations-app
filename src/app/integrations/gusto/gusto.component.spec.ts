import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { EventsService } from 'src/app/core/services/common/events.service';
import { GustoService } from 'src/app/core/services/gusto/gusto.service';
import { GustoMockConfiguration, GustoMockData, GustoMockConfigurationPayload, GustoMockWithoutToken, connectGustoMockData, workatoConnectionStatusMockDatawithTrue, workatoConnectionStatusMockData } from 'src/app/core/services/gusto/gusto.service.fixture';
import { generateTokenData, orgMockData } from 'src/app/core/services/org/org.fixture';
import { OrgService } from 'src/app/core/services/org/org.service';

import { GustoComponent } from './gusto.component';

describe('GustoComponent', () => {
  let component: GustoComponent;
  let fixture: ComponentFixture<GustoComponent>;
  let formBuilder: FormBuilder;
  let orgService: OrgService;
  let gustoService: GustoService;

  const service1 = {
    getCachedOrg: () => of(orgMockData),
    getAdditionalEmails: () => of(GustoMockConfiguration.additional_email_options),
    createWorkatoWorkspace: () => of({}),
    connectSendgrid: () => of({}),
    connectFyle: () => of({}),
    generateToken: () => of(generateTokenData),
    sanitizeUrl: () => of('fyle'),
    getOrgs: () => of(orgMockData)
  };

  const service2 = {
    connectGusto: () => of({}),
    getGustoData: () => of(GustoMockData),
    getConfigurations: () => of(GustoMockConfiguration),
    createFolder: () => of({}),
    uploadPackage: () => of({}),
    syncEmployees: () => of({}),
    postConfigurations: () => of(GustoMockConfigurationPayload),
    patchConfigurations: () => of(GustoMockConfigurationPayload),
    connect: () => of(connectGustoMockData)
  };

  const service3 = {
    getWorkatoConnectionStatus: of(workatoConnectionStatusMockDatawithTrue)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GustoComponent ],
      imports: [
        HttpClientModule, HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        MessageService,
        { provide: OrgService, useValue: service1 },
        { provide: GustoService, useValue: service2 },
        { provide: EventsService, useValue: service3 }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GustoComponent);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    orgService = TestBed.inject(OrgService);
    gustoService = TestBed.inject(GustoService);
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get Gusto Data', () => {
    (component as any).setupPage();
    expect(component.gustoData).toBe(GustoMockData);
    expect(component.isGustoConnected).toBeTrue();
  });

  it('should start syncing data for new logins', () => {
    spyOn(gustoService, 'getGustoData').and.returnValue(throwError({error: 'error'}));
    (component as any).setupPage();
    expect(component.isGustoConnected).toBeTrue();
  });

  it('should sync gusto data based on data', () => {
    component.gustoData = GustoMockWithoutToken;
    (component as any).setupGusto();
    expect(component.showErrorScreen).toBeUndefined();

    spyOn(gustoService, 'createFolder').and.returnValue(throwError({}));
    (component as any).setupGusto();
    expect(component.showErrorScreen).toBeTrue();
  });

  it(`get emails shoudn't fail incase of new orgs`, () => {
    spyOn(gustoService, 'getConfigurations').and.returnValue(throwError({}));
    (component as any).getGustoConfiguration();

    expect(component.additionalEmails).toEqual(GustoMockConfiguration.additional_email_options);
  });

  it('should sync employees', () => {
    component.isLoading = false;
    component.syncEmployees();

    expect(component.isLoading).toBeFalse();
  });

  it('should update/create configurations', () => {
    component.isConfigurationSaveInProgress = true;
    component.configurationUpdatesHandler(GustoMockConfigurationPayload);
    expect(component.isConfigurationSaveInProgress).toBeFalse();
  });

  it('setupgusto function else case', () => {
    component.org = orgMockData;
    component.org.is_fyle_connected = false;
    component.gustoData.connection_id = '';
    fixture.detectChanges();
    expect((component as any).setupGusto()).toBeUndefined();
  });

  it('getGustoConfiguration function check', () => {
    spyOn(orgService, 'getAdditionalEmails').and.returnValue(of([{email: 'dhaarani', name: 'dhaarani'}]));
    expect(component.getGustoConfiguration()).toBeUndefined();
  });

  it('addconnectionwidget function check', () => {
    spyOn(orgService, 'generateToken').and.returnValues(throwError({error: 404}));
    expect((component as any).addConnectionWidget()).toBeUndefined();
    expect(component.showErrorScreen).toBeTrue();
  });

  it('checkGustoDataAndTriggerConnectionWidget function check', () => {
    // @ts-ignore
    component.gustoData = undefined;
    expect((component as any).checkGustoDataAndTriggerConnectionWidget()).toBeUndefined();
    expect(component.isGustoConnected).toBeTrue();
  });

  it('updateOrCreateGustoConfiguration function check', () => {
    expect((component as any).updateOrCreateGustoConfiguration(workatoConnectionStatusMockData)).toBeUndefined();
    expect(component.isGustoConnected).toBeFalse();
  });

});
