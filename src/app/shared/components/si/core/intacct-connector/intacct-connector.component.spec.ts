import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IntacctConnectorComponent } from './intacct-connector.component';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/si-connector.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { SageIntacctCredential } from 'src/app/core/models/intacct/db/sage-credentials.model';
import { IntacctComponent } from 'src/app/integrations/intacct/intacct.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IntacctOnboardingConnectorComponent } from 'src/app/integrations/intacct/intacct-onboarding/intacct-onboarding-connector/intacct-onboarding-connector.component';

xdescribe('IntacctConnectorComponent', () => {
  let component: IntacctConnectorComponent;
  let fixture: ComponentFixture<IntacctConnectorComponent>;
  let mockConnectorService: jasmine.SpyObj<IntacctConnectorService>;
  let mockMappingsService: jasmine.SpyObj<SiMappingsService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let toastService: IntegrationsToastService;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    mockConnectorService = jasmine.createSpyObj('IntacctConnectorService', [
      'connectSageIntacct',
      'getSageIntacctCredential',
    ]);
    mockMappingsService = jasmine.createSpyObj('SiMappingsService', ['refreshSageIntacctDimensions']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    localStorage.setItem('si.workspaceId', '1');
    TestBed.configureTestingModule({
      declarations: [IntacctConnectorComponent, IntacctComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: IntacctConnectorService, useValue: mockConnectorService },
        { provide: SiMappingsService, useValue: mockMappingsService },
        { provide: MessageService, useValue: mockMessageService },
        IntacctComponent,
        IntacctOnboardingConnectorComponent,
        provideHttpClient(withInterceptorsFromDi()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IntacctConnectorComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    component.connectSageIntacctForm = formBuilder.group({
      userID: ['lklk'],
      companyID: ['kkjkkjkk'],
      userPassword: ['llkl'],
    });
    toastService = TestBed.inject(IntegrationsToastService);
  });

  it('should create', () => {
    const connectorResponse: SageIntacctCredential = {
      id: 1,
      si_user_id: 'string',
      si_company_id: 'string',
      si_company_name: 'string;',
      si_user_password: 'string;',
      created_at: new Date(),
      updated_at: new Date(),
      workspace: 1,
    };
    mockConnectorService.getSageIntacctCredential.and.returnValue(of(connectorResponse));
    expect(component).toBeTruthy();
    expect(component.ngOnInit()).toBeUndefined();
  });

  it('should call setupPage on component initialization', fakeAsync(() => {
    mockConnectorService.getSageIntacctCredential.and.returnValue(throwError({}));

    fixture.detectChanges();
    tick();

    expect(component.isLoading).toBe(false);
    expect(component.connectSageIntacctForm).toBeTruthy();
  }));
});
