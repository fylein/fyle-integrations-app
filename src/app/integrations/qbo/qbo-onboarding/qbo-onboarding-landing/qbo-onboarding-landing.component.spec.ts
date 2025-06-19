import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { QboOnboardingLandingComponent } from './qbo-onboarding-landing.component';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { QboConnectorService } from 'src/app/core/services/qbo/qbo-configuration/qbo-connector.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { EventEmitter } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

describe('QboOnboardingLandingComponent', () => {
  let component: QboOnboardingLandingComponent;
  let fixture: ComponentFixture<QboOnboardingLandingComponent>;
  let helperServiceSpy: jasmine.SpyObj<HelperService>;
  let qboConnectorServiceSpy: jasmine.SpyObj<QboConnectorService>;
  let toastServiceSpy: jasmine.SpyObj<IntegrationsToastService>;
  let workspaceServiceSpy: jasmine.SpyObj<WorkspaceService>;

  beforeEach(async () => {
    const helperSpy = jasmine.createSpyObj('HelperService', ['oauthHandler'], {
      oauthCallbackUrl: new EventEmitter<string>()
    });
    const qboConnectorSpy = jasmine.createSpyObj('QboConnectorService', ['connectQBO']);
    const toastSpy = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    const workspaceSpy = jasmine.createSpyObj('WorkspaceService', ['getOnboardingState']);
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, TranslocoModule],
      declarations: [QboOnboardingLandingComponent],
      providers: [
        { provide: HelperService, useValue: helperSpy },
        { provide: QboConnectorService, useValue: qboConnectorSpy },
        { provide: IntegrationsToastService, useValue: toastSpy },
        { provide: WorkspaceService, useValue: workspaceSpy },
        { provide: TranslocoService, useValue: translocoServiceSpy }
      ]
    }).compileComponents();

    helperServiceSpy = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
    qboConnectorServiceSpy = TestBed.inject(QboConnectorService) as jasmine.SpyObj<QboConnectorService>;
    toastServiceSpy = TestBed.inject(IntegrationsToastService) as jasmine.SpyObj<IntegrationsToastService>;
    workspaceServiceSpy = TestBed.inject(WorkspaceService) as jasmine.SpyObj<WorkspaceService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QboOnboardingLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call oauthHandler when connectQbo is called', () => {
    component.connectQbo();
    expect(helperServiceSpy.oauthHandler).toHaveBeenCalled();
  });

  it('should set qboConnectionInProgress to true when connectQbo is called', () => {
    component.connectQbo();
    expect(component.qboConnectionInProgress).toBeTrue();
  });
});