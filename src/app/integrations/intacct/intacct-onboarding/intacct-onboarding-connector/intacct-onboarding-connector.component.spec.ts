import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { IntacctOnboardingConnectorComponent } from './intacct-onboarding-connector.component';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';
import { IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('IntacctOnboardingConnectorComponent', () => {
  let component: IntacctOnboardingConnectorComponent;
  let fixture: ComponentFixture<IntacctOnboardingConnectorComponent>;
  let workspaceServiceSpy: jasmine.SpyObj<WorkspaceService>;
  let intacctConnectorSpy: jasmine.SpyObj<IntacctConnectorService>;

  beforeEach(async () => {
    const workspaceSpy = jasmine.createSpyObj('WorkspaceService', ['getOnboardingState']);
    const intacctConnectorSpyObj = jasmine.createSpyObj('IntacctConnectorService', ['getIntacctTokenHealthStatus']);

    await TestBed.configureTestingModule({
      declarations: [IntacctOnboardingConnectorComponent],
      imports: [SharedModule],
      providers: [
        { provide: WorkspaceService, useValue: workspaceSpy },
        { provide: IntacctConnectorService, useValue: intacctConnectorSpyObj },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        MessageService
      ]
    })
    .compileComponents();

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
