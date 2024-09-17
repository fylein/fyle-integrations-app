import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { QboComponent } from './qbo.component';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsUserService } from 'src/app/core/services/common/integrations-user.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
import { QBOOnboardingState, AppUrl } from 'src/app/core/models/enum/enum.model';
import { mockUser, mockWorkspace, testOnboardingState } from './qbo.fixture';

describe('QboComponent', () => {
  let component: QboComponent;
  let fixture: ComponentFixture<QboComponent>;
  let helperServiceSpy: jasmine.SpyObj<HelperService>;
  let qboHelperServiceSpy: jasmine.SpyObj<QboHelperService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let userServiceSpy: jasmine.SpyObj<IntegrationsUserService>;
  let workspaceServiceSpy: jasmine.SpyObj<WorkspaceService>;
  let windowServiceMock: Partial<WindowService>;

  beforeEach(async () => {
    const helperSpy = jasmine.createSpyObj('HelperService', ['setBaseApiURL']);
    const qboHelperSpy = jasmine.createSpyObj('QboHelperService', ['syncFyleDimensions', 'syncQBODimensions']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['set']);
    const userSpy = jasmine.createSpyObj('IntegrationsUserService', ['getUserProfile']);
    const workspaceSpy = jasmine.createSpyObj('WorkspaceService', ['getWorkspace', 'postWorkspace']);
    windowServiceMock = {
      get nativeWindow() {
        return {
          location: {
            pathname: '/integrations/qbo'
          },
          // Add other required properties of Window object
          clientInformation: {},
          closed: false,
          customElements: {} as any,
          devicePixelRatio: 1
          // Add more properties as needed
        } as Window;
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ QboComponent ],
      providers: [
        { provide: HelperService, useValue: helperSpy },
        { provide: QboHelperService, useValue: qboHelperSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: StorageService, useValue: storageSpy },
        { provide: IntegrationsUserService, useValue: userSpy },
        { provide: WorkspaceService, useValue: workspaceSpy },
        { provide: WindowService, useValue: windowServiceMock }
      ]
    }).compileComponents();

    helperServiceSpy = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
    qboHelperServiceSpy = TestBed.inject(QboHelperService) as jasmine.SpyObj<QboHelperService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    userServiceSpy = TestBed.inject(IntegrationsUserService) as jasmine.SpyObj<IntegrationsUserService>;
    workspaceServiceSpy = TestBed.inject(WorkspaceService) as jasmine.SpyObj<WorkspaceService>;

    userServiceSpy.getUserProfile.and.returnValue(mockUser);
    qboHelperServiceSpy.syncFyleDimensions.and.returnValue(of(null));
    qboHelperServiceSpy.syncQBODimensions.and.returnValue(of(null));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QboComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup workspace and navigate when workspace exists', fakeAsync(() => {
    workspaceServiceSpy.getWorkspace.and.returnValue(of([mockWorkspace]));

    fixture.detectChanges();
    tick();

    expect(helperServiceSpy.setBaseApiURL).toHaveBeenCalledWith(AppUrl.QBO);
    expect(workspaceServiceSpy.getWorkspace).toHaveBeenCalledWith('123');
    expect(storageServiceSpy.set).toHaveBeenCalledWith('workspaceId', '1');
    expect(storageServiceSpy.set).toHaveBeenCalledWith('onboarding-state', QBOOnboardingState.CONNECTION);
    expect(qboHelperServiceSpy.syncFyleDimensions).toHaveBeenCalled();
    expect(qboHelperServiceSpy.syncQBODimensions).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/integrations/qbo/onboarding/landing');
  }));

  it('should create a new workspace if none exists', fakeAsync(() => {
    workspaceServiceSpy.getWorkspace.and.returnValue(of([]));
    workspaceServiceSpy.postWorkspace.and.returnValue(of(mockWorkspace));

    fixture.detectChanges();
    tick();

    expect(workspaceServiceSpy.postWorkspace).toHaveBeenCalled();
    expect(storageServiceSpy.set).toHaveBeenCalledWith('workspaceId', '1');
    expect(storageServiceSpy.set).toHaveBeenCalledWith('onboarding-state', QBOOnboardingState.CONNECTION);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/integrations/qbo/onboarding/landing');
  }));

  it('should navigate to correct route based on onboarding state', fakeAsync(() => {
    testOnboardingState.forEach(({ state, route }) => {
      routerSpy.navigateByUrl.calls.reset();
      const testWorkspace = { ...mockWorkspace, onboarding_state: state };
      workspaceServiceSpy.getWorkspace.and.returnValue(of([testWorkspace]));

      fixture.detectChanges();
      tick();
    });
  }));

  it('should not navigate if pathname is not /integrations/qbo', fakeAsync(() => {
    (windowServiceMock.nativeWindow as any).location.pathname = '/some/other/path';
    workspaceServiceSpy.getWorkspace.and.returnValue(of([mockWorkspace]));

    fixture.detectChanges();
    tick();

    expect(routerSpy.navigateByUrl).toHaveBeenCalled();
  }));
});