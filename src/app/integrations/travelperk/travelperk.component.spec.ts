import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk.service';
import { of, throwError } from 'rxjs';
import { TravelperkComponent } from './travelperk.component';
import { OrgService } from 'src/app/core/services/org/org.service';
import { generateTokenData, orgMockData } from 'src/app/core/services/org/org.fixture';
import { connectAwsS3MockData, connectTravelperkMockData, travelperkErrorMockData, travelperkMockData, workatoConnectionStatusMockData } from 'src/app/core/services/travelperk/travelperk.fixture';
import { EventsService } from 'src/app/core/services/common/events.service';
import { MessageService } from 'primeng/api';

xdescribe('TravelperkComponent', () => {
  let component: TravelperkComponent;
  let fixture: ComponentFixture<TravelperkComponent>;
  let orgService: OrgService;
  let travelperkService: TravelperkService;
  let eventsService: EventsService;

  const service1 = {
    createFolder: () => of({}),
    uploadPackage: () => of({}),
    getTravelperkData: () => of(throwError({})),
    connectTravelperk: () => of(connectTravelperkMockData),
    connectAwsS3: () => of(connectAwsS3MockData),
    getConfigurations: () => of(throwError({})),
    patchConfigurations: () => of({}),
    postConfigurations: () => of({}),
    connect: () => of({})
  };

  const service2 = {
    sanitizeUrl: () => of('dabdwba'),
    createWorkatoWorkspace: () => of({}),
    connectFyle: () => of({}),
    generateToken: () => of(generateTokenData),
    getCachedOrg: () => of(orgMockData),
    getOrgs: () => of([orgMockData])
  };

  const service3 = {
    getWorkatoConnectionStatus: of(workatoConnectionStatusMockData)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelperkComponent ],
      imports: [
        HttpClientModule, HttpClientTestingModule
      ],
      providers: [
        {provide: TravelperkService, useValue: service1},
        {provide: OrgService, useValue: service2 },
        {provide: EventsService, useValue: service3},
        MessageService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelperkComponent);
    component = fixture.componentInstance;
    orgService = TestBed.inject(OrgService);
    travelperkService = TestBed.inject(TravelperkService);
    eventsService = TestBed.inject(EventsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get Travelperk Data', () => {
    spyOn(travelperkService, 'getTravelperkData').and.returnValue(of(travelperkMockData));
    (component as any).setupPage();
    expect(component.travelperkData).toEqual(travelperkMockData);
  });

  it('should sync travelperk based on data', () => {
    const travelperkMockDataWithoutSyncData = Object.create(travelperkMockData);
    travelperkMockDataWithoutSyncData.folder_id = null;
    travelperkMockDataWithoutSyncData.is_fyle_connected = false;
    travelperkMockDataWithoutSyncData.travelperk_connection_id = 876;
    travelperkMockDataWithoutSyncData.is_s3_connected = false;
    spyOn(travelperkService, 'getTravelperkData').and.returnValue(of(travelperkMockDataWithoutSyncData));
    fixture.detectChanges();

    (component as any).setupPage();
  });

  it('should show error screen if connection widget fails', () => {
    spyOn(travelperkService, 'getTravelperkData').and.returnValue(of(travelperkMockData));
    spyOn(orgService, 'generateToken').and.returnValue(throwError({}));

    (component as any).setupPage();
  });

  it('should return syncData based on mock data', () => {
    spyOn(travelperkService, 'getTravelperkData').and.returnValue(throwError({}));

    const syncData = (component as any).syncData();
    expect(syncData.length).toBeGreaterThanOrEqual(6);
  });

  it('should show failed page if syncing of data api failed', () => {
    spyOn(travelperkService, 'getTravelperkData').and.returnValue(throwError({}));
    spyOn(travelperkService, 'createFolder').and.returnValue(throwError({}));

    (component as any).setupPage();
  });

  it('should disconnect travelperk', () => {
    spyOn(orgService, 'generateToken').and.returnValue(throwError({}));
    expect(component.isIntegrationConnected).toBeFalse();
  });

  it('should connect to travelperk with new tab', fakeAsync(() => {
    const popupMock: any = {
      closed: false,
      location: { href: 'https://yourredirecturi.com?code=123456789' },
      close: jasmine.createSpy('close')
    };
    spyOn(window, 'open').and.returnValue(popupMock);
    tick(500);

    expect(window.open).toHaveBeenCalled();
    expect(component.isIntegrationConnected).toBe(true);
    expect(popupMock.close).toHaveBeenCalled();
  }));
});
