import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { QbdFieldMappingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-field-mapping.service';
import { IntegrationsToastService } from 'src/app/core/services/qbd/qbd-core/qbd-toast.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { FieldMappingComponent } from './field-mapping.component';
import { errorResponse, QBDFieldMappingResponse, QBDFieldMappingResponse2 } from './field-mapping.fixture';

describe('FieldMappingComponent', () => {
  let component: FieldMappingComponent;
  let fixture: ComponentFixture<FieldMappingComponent>;
  let service1: any;
  let service2: any;
  let service3: any;
  let formbuilder: FormBuilder;
  let qbdFieldMappingService: QbdFieldMappingService;
  let qbdWorkspaceService: QbdWorkspaceService;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;
  beforeEach(async () => {

    service1 = {
      getQbdFieldMapping: () => of(QBDFieldMappingResponse),
      postQbdFieldMapping: () => of(QBDFieldMappingResponse)
    };

    service2 = {
      getOnboardingState: () => QBDOnboardingState.FIELD_MAPPINGS,
      setOnboardingState: () => undefined
    };

    service3 = {
      displayToastMessage: () => undefined
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule, SharedModule, NoopAnimationsModule],
      declarations: [ FieldMappingComponent ],
      providers: [FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: QbdFieldMappingService, useValue: service1 },
        { provide: QbdWorkspaceService, useValue: service2 },
        { provide: IntegrationsToastService, useValue: service3 }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldMappingComponent);
    component = fixture.componentInstance;
    formbuilder = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);
    qbdWorkspaceService = TestBed.inject(QbdWorkspaceService);
    qbdFieldMappingService = TestBed.inject(QbdFieldMappingService);
    component.fieldMappingForm = formbuilder.group({
      classType: ['CLASS'],
      customerType: ['PROJECT']
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Save function check', () => {
    expect(component.save()).toBeUndefined();
    spyOn(qbdWorkspaceService, 'getOnboardingState').and.returnValue(QBDOnboardingState.COMPLETE);
    expect(component.save()).toBeUndefined();
    component.isOnboarding = true;
    expect(component.save()).toBeUndefined();
  });

  it('Save function check', () => {
    component.isOnboarding = true;
    expect(component.constructPayloadAndSave()).toBeUndefined();
  });

  it('Save function check with failed api response', () => {
    component.isOnboarding = true;
    spyOn(qbdFieldMappingService, 'postQbdFieldMapping').and.returnValue(throwError(errorResponse));
    expect(component.constructPayloadAndSave()).toBeUndefined();
  });

  it('form with null data', () => {
    spyOn(qbdFieldMappingService, 'getQbdFieldMapping').and.returnValue(of(QBDFieldMappingResponse2));
    expect((component as any).getSettingsAndSetupForm()).toBeUndefined();
    fixture.detectChanges();
    expect((component as any).constructPayloadAndSave()).toBeUndefined();
  });

  it('getsettingsAndsetupForm function check', () => {
    spyOn(qbdFieldMappingService, 'getQbdFieldMapping').and.returnValue(throwError(errorResponse));
    expect((component as any).getSettingsAndSetupForm()).toBeUndefined();
  });

});
