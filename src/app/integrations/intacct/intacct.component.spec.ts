import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd, provideRouter } from '@angular/router';
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

describe('IntacctComponent', () => {
  let component: IntacctComponent;
  let fixture: ComponentFixture<IntacctComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let workspaceServiceSpy: jasmine.SpyObj<SiWorkspaceService>;
  let helperServiceSpy: jasmine.SpyObj<HelperService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let windowServiceMock: Partial<WindowService>;
  let router: Router;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', ['getUserProfile']);
    const workspaceSpy = jasmine.createSpyObj('SiWorkspaceService', ['getWorkspace', 'postWorkspace', 'syncFyleDimensions', 'syncIntacctDimensions']);
    const helperSpy = jasmine.createSpyObj('HelperService', ['setBaseApiURL']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['set']);
    const authSpy = jasmine.createSpyObj('AuthService', ['updateUserTokens']);

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
    imports: [SharedModule],
    providers: [
        { provide: HelperService, useValue: helperSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: UserService, useValue: userSpy },
        { provide: SiWorkspaceService, useValue: workspaceSpy },
        { provide: WindowService, useValue: windowServiceMock },
        { provide: AuthService, useValue: authSpy },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    workspaceServiceSpy = TestBed.inject(SiWorkspaceService) as jasmine.SpyObj<SiWorkspaceService>;
    helperServiceSpy = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

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

  it('should update the user\'s tokens', () => {
    fixture.detectChanges();
    expect(authServiceSpy.updateUserTokens).toHaveBeenCalledOnceWith('INTACCT');
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

});