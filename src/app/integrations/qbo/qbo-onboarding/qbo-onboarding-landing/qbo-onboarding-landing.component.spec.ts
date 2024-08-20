import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationExtras } from '@angular/router';
import { of, throwError } from 'rxjs';
import { QboOnboardingLandingComponent } from './qbo-onboarding-landing.component';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { QboConnectorService } from 'src/app/core/services/qbo/qbo-configuration/qbo-connector.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QBOOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';

describe('QboOnboardingLandingComponent', () => {
  let component: QboOnboardingLandingComponent;
  let fixture: ComponentFixture<QboOnboardingLandingComponent>;
  let helperServiceSpy: jasmine.SpyObj<HelperService>;
  let qboConnectorServiceSpy: jasmine.SpyObj<QboConnectorService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastServiceSpy: jasmine.SpyObj<IntegrationsToastService>;
  let workspaceServiceSpy: jasmine.SpyObj<WorkspaceService>;

  beforeEach(() => {
    const helperSpy = jasmine.createSpyObj('HelperService', ['oauthHandler']);
    const qboConnectorSpy = jasmine.createSpyObj('QboConnectorService', ['connectQBO']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastSpy = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    const workspaceSpy = jasmine.createSpyObj('WorkspaceService', ['getOnboardingState']);

    TestBed.configureTestingModule({
      declarations: [ QboOnboardingLandingComponent ],
      providers: [
        { provide: HelperService, useValue: helperSpy },
        { provide: QboConnectorService, useValue: qboConnectorSpy },
        { provide: Router, useValue: routerSpy },
        { provide: IntegrationsToastService, useValue: toastSpy },
        { provide: WorkspaceService, useValue: workspaceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QboOnboardingLandingComponent);
    component = fixture.componentInstance;
    helperServiceSpy = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
    qboConnectorServiceSpy = TestBed.inject(QboConnectorService) as jasmine.SpyObj<QboConnectorService>;
    toastServiceSpy = TestBed.inject(IntegrationsToastService) as jasmine.SpyObj<IntegrationsToastService>;
    workspaceServiceSpy = TestBed.inject(WorkspaceService) as jasmine.SpyObj<WorkspaceService>;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});