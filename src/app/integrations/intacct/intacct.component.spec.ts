import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { IntacctComponent } from './intacct.component';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { AppcuesService } from 'src/app/core/services/integration/appcues.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { AppUrl, IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { mockUser, testOnboardingState, workspaceResponse } from './intacct.fixture';
import { IntacctWorkspace } from 'src/app/core/models/intacct/db/workspaces.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

xdescribe('IntacctComponent', () => {
  let component: IntacctComponent;
  let fixture: ComponentFixture<IntacctComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let workspaceServiceSpy: jasmine.SpyObj<SiWorkspaceService>;
  let helperServiceSpy: jasmine.SpyObj<HelperService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let windowServiceMock: Partial<WindowService>;
  let appcuesServiceSpy: jasmine.SpyObj<AppcuesService>;
  let router: Router;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', ['getUserProfile']);
    const workspaceSpy = jasmine.createSpyObj('SiWorkspaceService', ['getWorkspace', 'postWorkspace', 'syncFyleDimensions', 'syncIntacctDimensions']);
    const helperSpy = jasmine.createSpyObj('HelperService', ['setBaseApiURL']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['set']);
    const appcuesSpy = jasmine.createSpyObj('AppcuesService', ['initialiseAppcues']);

    windowServiceMock = {
      get nativeWindow() {
        return {
          location: {
            pathname: '/integrations/intacct'
          }
        } as Window;
      }
    };

    await TestBed.configureTestingModule({
      declarations: [IntacctComponent],
      imports: [SharedModule, HttpClientTestingModule],
      providers: [
        { provide: HelperService, useValue: helperSpy },
        { provide: AppcuesService, useValue: appcuesSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: UserService, useValue: userSpy },
        { provide: SiWorkspaceService, useValue: workspaceSpy },
        { provide: WindowService, useValue: windowServiceMock },
        provideRouter([])
      ]
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    workspaceServiceSpy = TestBed.inject(SiWorkspaceService) as jasmine.SpyObj<SiWorkspaceService>;
    helperServiceSpy = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    router = TestBed.inject(Router);
    appcuesServiceSpy = TestBed.inject(AppcuesService) as jasmine.SpyObj<AppcuesService>;

    spyOn(router, 'navigateByUrl');
    spyOnProperty(router, 'events').and.returnValue(of(new NavigationEnd(0, '', '')));
    userServiceSpy.getUserProfile.and.returnValue(mockUser);
    workspaceServiceSpy.getWorkspace.and.returnValue(of(workspaceResponse));
    workspaceServiceSpy.syncFyleDimensions.and.returnValue(of());
    workspaceServiceSpy.syncIntacctDimensions.and.returnValue(of());

    fixture = TestBed.createComponent(IntacctComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup workspace and navigate when workspace exists', () => {
    fixture.detectChanges();

    expect(helperServiceSpy.setBaseApiURL).toHaveBeenCalledWith(AppUrl.INTACCT);
    expect(workspaceServiceSpy.getWorkspace).toHaveBeenCalledWith('mock org id');
    expect(storageServiceSpy.set).toHaveBeenCalledWith('workspaceId', 1);
    expect(storageServiceSpy.set).toHaveBeenCalledWith('onboarding-state', IntacctOnboardingState.CONNECTION);
    expect(workspaceServiceSpy.syncFyleDimensions).toHaveBeenCalled();
    expect(workspaceServiceSpy.syncIntacctDimensions).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/integrations/intacct/onboarding/landing');
  });

  it('should create a new workspace if none exists', () => {
    workspaceServiceSpy.getWorkspace.and.returnValue(of([]));
    workspaceServiceSpy.postWorkspace.and.returnValue(of(workspaceResponse[0]));

    fixture.detectChanges();

    expect(workspaceServiceSpy.postWorkspace).toHaveBeenCalled();
    expect(storageServiceSpy.set).toHaveBeenCalledWith('workspaceId', 1);
    expect(storageServiceSpy.set).toHaveBeenCalledWith('onboarding-state', IntacctOnboardingState.CONNECTION);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/integrations/intacct/onboarding/landing');
  });

  it('should navigate to correct route based on onboarding state', () => {
    Object.entries(testOnboardingState).forEach(([state, route]) => {
      const testWorkspace: IntacctWorkspace = { ...workspaceResponse[0], onboarding_state: state as IntacctOnboardingState };
      workspaceServiceSpy.getWorkspace.and.returnValue(of([testWorkspace]));

      fixture.detectChanges();

      expect(router.navigateByUrl).toHaveBeenCalledWith(route);

      fixture = TestBed.createComponent(IntacctComponent);
      component = fixture.componentInstance;
    });
  });

  it('should not navigate if pathname is not /integrations/intacct', () => {
    component.windowReference.location.pathname = '/some/other/path';
    fixture.detectChanges();

    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should initialise Appcues', () => {
    (window as any).Appcues = {
      page: jasmine.createSpy('Appcues.page')
    };

    fixture.detectChanges();

    expect(appcuesServiceSpy.initialiseAppcues).toHaveBeenCalled();
    expect((window as any).Appcues.page).toHaveBeenCalled();
  });
});