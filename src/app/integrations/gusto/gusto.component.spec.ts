import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { GustoService } from 'src/app/core/services/gusto/gusto.service';
import { GustoMockConfiguration, GustoMockData, GustoMockConfigurationPayload, GustoMockWithoutToken } from 'src/app/core/services/gusto/gusto.service.fixture';
import { orgMockData } from 'src/app/core/services/org/org.fixture';
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
    connectFyle: () => of({})
  };

  const service2 = {
    connectGusto: () => of({}),
    getGustoData: () => of(GustoMockData),
    getConfigurations: () => of(GustoMockConfiguration),
    createFolder: () => of({}),
    uploadPackage: () => of({}),
    disconnectGusto: () => of({}),
    syncEmployees: () => of({}),
    postConfigurations: () => of(GustoMockConfigurationPayload)
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
        { provide: GustoService, useValue: service2 }
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

  it('should get Bamboo HR Data', () => {
    (component as any).setupPage();
    expect(component.gustoData).toBe(GustoMockData);
    expect(component.isGustoConnected).toBe(true);

    const gustoMockData2 = { ...GustoMockData };
    gustoMockData2.folder_id = '';
    spyOn(gustoService, 'getGustoData').and.returnValue(of(gustoMockData2));
    (component as any).setupPage();
    expect(component.gustoData).toBe(gustoMockData2);
    expect(component.isGustoConnected).toBe(false);
  });

  it('should start syncing data for new logins', () => {
    spyOn(gustoService, 'getGustoData').and.returnValue(throwError({}));
    (component as any).setupPage();
    expect(component.isGustoConnected).toBe(false);
  });

  it('should sync bamboo hr data based on data', () => {
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

  it('should disconnect Gusto', () => {
    component.isLoading = true;
    component.disconnectGusto();

    expect(component.isGustoConnected).toBeTrue();
    expect(component.isLoading).toBeTrue();
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
    component.org.is_fyle_connected;
    fixture.detectChanges();
    expect((component as any).setupGusto()).toBeUndefined();
  });

});
