import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd, provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IntacctComponent } from './intacct.component';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { AppUrl, IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { mockUser, testOnboardingState, workspaceResponse } from './intacct.fixture';
import { IntacctWorkspace } from 'src/app/core/models/intacct/db/workspaces.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/common/auth.service';
import { MessageService } from 'primeng/api';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/si-connector.service';
import { SiAuthService } from 'src/app/core/services/si/si-core/si-auth.service';

describe('IntacctComponent', () => {
  let component: IntacctComponent;
  let fixture: ComponentFixture<IntacctComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let workspaceServiceSpy: jasmine.SpyObj<SiWorkspaceService>;
  let helperServiceSpy: jasmine.SpyObj<HelperService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let intacctConnectorSpy: jasmine.SpyObj<IntacctConnectorService>;
  let siAuthServiceSpy: jasmine.SpyObj<SiAuthService>;
  let windowServiceMock: Partial<WindowService>;
  let activatedRouteMock: Partial<ActivatedRoute>;
  let router: Router;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', ['getUserProfile']);
    const workspaceSpy = jasmine.createSpyObj('SiWorkspaceService', [
      'getWorkspace',
      'postWorkspace',
      'syncFyleDimensions',
      'syncIntacctDimensions',
    ]);
    const helperSpy = jasmine.createSpyObj('HelperService', ['setBaseApiURL']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['set']);
    const authSpy = jasmine.createSpyObj('AuthService', ['updateUserTokens']);
    const intacctConnectorSpyObj = jasmine.createSpyObj('IntacctConnectorService', ['getIntacctTokenHealthStatus']);
    const siAuthSpy = jasmine.createSpyObj('SiAuthService', ['loginWithAuthCode']);

    windowServiceMock = {
      get nativeWindow() {
        return {
          location: {
            pathname: '/integrations/intacct',
          },
        } as Window;
      },
    };

    activatedRouteMock = {
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      declarations: [IntacctComponent],
      imports: [SharedModule],
      providers: [
        { provide: HelperService, useValue: helperSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: UserService, useValue: userSpy },
        { provide: SiWorkspaceService, useValue: workspaceSpy },
        { provide: WindowService, useValue: windowServiceMock },
        { provide: AuthService, useValue: authSpy },
        { provide: IntacctConnectorService, useValue: intacctConnectorSpyObj },
        { provide: SiAuthService, useValue: siAuthSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        MessageService,
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    workspaceServiceSpy = TestBed.inject(SiWorkspaceService) as jasmine.SpyObj<SiWorkspaceService>;
    helperServiceSpy = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    intacctConnectorSpy = TestBed.inject(IntacctConnectorService) as jasmine.SpyObj<IntacctConnectorService>;
    siAuthServiceSpy = TestBed.inject(SiAuthService) as jasmine.SpyObj<SiAuthService>;
    router = TestBed.inject(Router);

    spyOn(router, 'navigateByUrl');
    spyOnProperty(router, 'events').and.returnValue(of(new NavigationEnd(0, '', '')));
    userServiceSpy.getUserProfile.and.returnValue(mockUser);
    workspaceServiceSpy.getWorkspace.and.returnValue(of(workspaceResponse));
    workspaceServiceSpy.syncFyleDimensions.and.returnValue(of());
    workspaceServiceSpy.syncIntacctDimensions.and.returnValue(of());
    intacctConnectorSpy.getIntacctTokenHealthStatus.and.returnValue(of(true)); // Mock token as valid

    fixture = TestBed.createComponent(IntacctComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should update the user's tokens", () => {
    fixture.detectChanges();
    expect(authServiceSpy.updateUserTokens).toHaveBeenCalledOnceWith('INTACCT');
  });

  it('should setup workspace and navigate when workspace exists', async () => {
    fixture.detectChanges();

    // Wait for async operations to complete
    await fixture.whenStable();

    expect(helperServiceSpy.setBaseApiURL).toHaveBeenCalledWith(AppUrl.INTACCT);
    expect(workspaceServiceSpy.getWorkspace).toHaveBeenCalledWith('mock org id');
    expect(storageServiceSpy.set).toHaveBeenCalledWith('workspaceId', 1);
    expect(storageServiceSpy.set).toHaveBeenCalledWith('onboarding-state', IntacctOnboardingState.CONNECTION);
    expect(workspaceServiceSpy.syncFyleDimensions).toHaveBeenCalled();
    expect(workspaceServiceSpy.syncIntacctDimensions).toHaveBeenCalled();
    expect(intacctConnectorSpy.getIntacctTokenHealthStatus).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/integrations/intacct/onboarding/landing');
  });

  it('should create a new workspace if none exists', async () => {
    workspaceServiceSpy.getWorkspace.and.returnValue(of([]));
    workspaceServiceSpy.postWorkspace.and.returnValue(of(workspaceResponse[0]));

    fixture.detectChanges();

    await fixture.whenStable();

    expect(workspaceServiceSpy.postWorkspace).toHaveBeenCalled();
    expect(storageServiceSpy.set).toHaveBeenCalledWith('workspaceId', 1);
    expect(storageServiceSpy.set).toHaveBeenCalledWith('onboarding-state', IntacctOnboardingState.CONNECTION);
    expect(intacctConnectorSpy.getIntacctTokenHealthStatus).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/integrations/intacct/onboarding/landing');
  });

  it('should navigate to correct route based on onboarding state', async () => {
    for (const [state, route] of Object.entries(testOnboardingState)) {
      (router.navigateByUrl as jasmine.Spy).calls.reset();

      const testWorkspace: IntacctWorkspace = {
        ...workspaceResponse[0],
        onboarding_state: state as IntacctOnboardingState,
      };
      workspaceServiceSpy.getWorkspace.and.returnValue(of([testWorkspace]));

      fixture = TestBed.createComponent(IntacctComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();

      await fixture.whenStable();

      expect(router.navigateByUrl).toHaveBeenCalledWith(route);
    }
  });

  it('should not navigate if pathname is not /integrations/intacct', () => {
    component.windowReference.location.pathname = '/some/other/path';
    fixture.detectChanges();

    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
