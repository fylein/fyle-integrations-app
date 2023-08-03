import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IntacctConnectorComponent } from './intacct-connector.component';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { SageIntacctCredential } from 'src/app/core/models/si/db/sage-credentials.model';
import { SiComponent } from 'src/app/integrations/si/si.component';
import { HttpClientModule } from '@angular/common/http';
import { OnboardingIntacctConnectorComponent } from 'src/app/integrations/si/onboarding/onboarding-intacct-connector/onboarding-intacct-connector.component';

describe('IntacctConnectorComponent', () => {
  let component: IntacctConnectorComponent;
  let fixture: ComponentFixture<IntacctConnectorComponent>;
  let mockConnectorService: jasmine.SpyObj<IntacctConnectorService>;
  let mockMappingsService: jasmine.SpyObj<SiMappingsService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let toastService: IntegrationsToastService;

  beforeEach(() => {
    mockConnectorService = jasmine.createSpyObj('IntacctConnectorService', ['connectSageIntacct', 'getSageIntacctCredential']);
    mockMappingsService = jasmine.createSpyObj('SiMappingsService', ['refreshSageIntacctDimensions']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      declarations: [IntacctConnectorComponent, SiComponent], // Include SiComponent
      imports: [ReactiveFormsModule, HttpClientModule], // Add HttpClientModule
      providers: [
        FormBuilder,
        { provide: IntacctConnectorService, useValue: mockConnectorService },
        { provide: SiMappingsService, useValue: mockMappingsService },
        { provide: MessageService, useValue: mockMessageService },
        // Provide the real SiComponent or a mock/stub if needed
        SiComponent, // You can provide a real instance if necessary
        // Or provide a mock/stub if the real SiComponent is not needed for your tests
        OnboardingIntacctConnectorComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IntacctConnectorComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(IntegrationsToastService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setupPage on component initialization', fakeAsync(() => {
    mockConnectorService.getSageIntacctCredential.and.returnValue(throwError({}));

    fixture.detectChanges();
    tick();

    expect(component.isLoading).toBe(false);
    expect(component.connectSageIntacctForm).toBeTruthy();
  }));
});
