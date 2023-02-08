import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService, SharedModule } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { QbdFieldMappingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-field-mapping.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';

import { FieldMappingComponent } from './field-mapping.component';
import { errorResponse, QBDFieldMappingResponse, QBDFieldMappingResponse2 } from './field-mapping.fixture';

describe('FieldMappingComponent', () => {
  let component: FieldMappingComponent;
  let fixture: ComponentFixture<FieldMappingComponent>;
  let service1: any;
  let service2: any;
  let formbuilder: FormBuilder;
  let qbdFieldMappingService: QbdFieldMappingService;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;
  beforeEach(async () => {

    service1 = {
      getQbdFieldMapping: () => of(QBDFieldMappingResponse),
      postQbdFieldMapping: () => of(QBDFieldMappingResponse)
    };

    service2 = {
      getOnboardingState: () => QBDOnboardingState.FIELD_MAPPING,
      setOnboardingState: () => undefined
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule, SharedModule, NoopAnimationsModule],
      declarations: [ FieldMappingComponent ],
      providers: [MessageService, FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: QbdFieldMappingService, useValue: service1 },
        { provide: QbdWorkspaceService, useValue: service2 }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldMappingComponent);
    component = fixture.componentInstance;
    formbuilder = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);
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
  });

  it('Save function check', () => {
    component.isOnboarding = true;
    fixture.detectChanges();
    expect(component.save()).toBeUndefined();
  });

  it('Save function check with failed api response', () => {
    component.isOnboarding = true;
    spyOn(qbdFieldMappingService, 'postQbdFieldMapping').and.returnValue(throwError(errorResponse));
    fixture.detectChanges();
    expect(component.save()).toBeUndefined();
  });

  it('form with null data', () => {
    spyOn(qbdFieldMappingService, 'getQbdFieldMapping').and.returnValue(of(QBDFieldMappingResponse2));
    fixture.detectChanges();
    expect((component as any).getSettingsAndSetupForm()).toBeUndefined();
    expect((component as any).constructPayloadAndSave()).toBeUndefined();
  });

  it('getsettingsAndsetupForm fuunction check', () => {
    spyOn(qbdFieldMappingService, 'getQbdFieldMapping').and.returnValue(throwError(errorResponse));
    fixture.detectChanges();
    expect((component as any).getSettingsAndSetupForm()).toBeUndefined();
  });

});
