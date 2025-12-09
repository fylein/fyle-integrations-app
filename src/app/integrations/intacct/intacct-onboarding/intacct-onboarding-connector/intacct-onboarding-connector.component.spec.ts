import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { IntacctOnboardingConnectorComponent } from './intacct-onboarding-connector.component';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/si-connector.service';
import { IntacctOnboardingService } from 'src/app/core/services/si/si-configuration/si-onboarding.service';
import { IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

describe('IntacctOnboardingConnectorComponent', () => {
  let component: IntacctOnboardingConnectorComponent;
  let fixture: ComponentFixture<IntacctOnboardingConnectorComponent>;
  let workspaceServiceSpy: jasmine.SpyObj<WorkspaceService>;
  let intacctConnectorSpy: jasmine.SpyObj<IntacctConnectorService>;

  beforeEach(async () => {
    const workspaceSpy = jasmine.createSpyObj('WorkspaceService', ['getOnboardingState']);
    const intacctConnectorSpyObj = jasmine.createSpyObj('IntacctConnectorService', ['getIntacctTokenHealthStatus']);
    const intacctOnboardingServiceSpy = jasmine.createSpyObj('IntacctOnboardingService', ['getOnboardingSteps']);
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate'], {
      config: {
        reRenderOnLangChange: true,
      },
      langChanges$: of('en'),
      _loadDependencies: () => Promise.resolve(),
    });

    translocoServiceSpy.translate.and.returnValue('Intacct Connection');
    intacctOnboardingServiceSpy.getOnboardingSteps.and.returnValue([]);

    await TestBed.configureTestingModule({
      declarations: [IntacctOnboardingConnectorComponent],
      imports: [SharedModule, TranslocoModule],
      providers: [
        { provide: WorkspaceService, useValue: workspaceSpy },
        { provide: IntacctConnectorService, useValue: intacctConnectorSpyObj },
        { provide: IntacctOnboardingService, useValue: intacctOnboardingServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        MessageService,
        { provide: TranslocoService, useValue: translocoServiceSpy },
      ],
    }).compileComponents();

    workspaceServiceSpy = TestBed.inject(WorkspaceService) as jasmine.SpyObj<WorkspaceService>;
    intacctConnectorSpy = TestBed.inject(IntacctConnectorService) as jasmine.SpyObj<IntacctConnectorService>;
    workspaceServiceSpy.getOnboardingState.and.returnValue(IntacctOnboardingState.CONNECTION);
    intacctConnectorSpy.getIntacctTokenHealthStatus.and.returnValue(of(true));

    fixture = TestBed.createComponent(IntacctOnboardingConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setupConnectionStatus function check', () => {
    component.setupConnectionStatus(true);

    expect(intacctConnectorSpy.getIntacctTokenHealthStatus).toHaveBeenCalled();
    expect(component.isIntacctCredentialsValid).toBeTrue();
  });
});
