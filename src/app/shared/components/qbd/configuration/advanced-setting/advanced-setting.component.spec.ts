import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService, SharedModule } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { QbdAdvancedSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-advanced-setting.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';

import { AdvancedSettingComponent } from './advanced-setting.component';
import { errorResponse, QBDAdvancedSettingResponse, QBDAdvancedSettingResponse2 } from './advanced-setting.fixture';

describe('AdvancedSettingComponent', () => {
  let component: AdvancedSettingComponent;
  let fixture: ComponentFixture<AdvancedSettingComponent>;
  let service1: any;
  let service2: any;
  let formbuilder: FormBuilder;
  let qbdAdvancedSettingService: QbdAdvancedSettingService;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;
  beforeEach(async () => {
    service1 = {
      getQbdAdvancedSettings: () => of(QBDAdvancedSettingResponse),
      postQbdAdvancedSettings: () => of(QBDAdvancedSettingResponse)
    };

    service2 = {
      getOnboardingState: () => QBDOnboardingState.ADVANCED_SETTINGS,
      setOnboardingState: () => undefined
    };
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule, SharedModule, NoopAnimationsModule],
      declarations: [ AdvancedSettingComponent ],
      providers: [
        MessageService, FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: QbdAdvancedSettingService, useValue: service1 },
        { provide: QbdWorkspaceService, useValue: service2 }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedSettingComponent);
    component = fixture.componentInstance;
    formbuilder = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);
    qbdAdvancedSettingService = TestBed.inject(QbdAdvancedSettingService);
    component.advancedSettings = QBDAdvancedSettingResponse;
    component.advancedSettingsForm = formbuilder.group({
      expenseMemoStructure: [component.advancedSettings?.expense_memo_structure ? component.advancedSettings?.expense_memo_structure : null],
        topMemoStructure: [component.advancedSettings?.top_memo_structure ? component.advancedSettings?.top_memo_structure : null],
        AdvancedSchedule: [component.advancedSettings?.schedule_is_enabled ? component.advancedSettings?.schedule_is_enabled : null],
        AdvancedScheduleFrequency: [component.advancedSettings?.interval_hours ? component.advancedSettings?.interval_hours : null],
        email: [component.advancedSettings?.emails ? component.advancedSettings?.emails : null],
        frequency: [component.advancedSettings?.frequency ? component.advancedSettings?.frequency : null],
        dayOfMonth: [component.advancedSettings?.day_of_month ? component.advancedSettings?.day_of_month : null],
        dayOfWeek: [component.advancedSettings?.day_of_week ? component.advancedSettings?.day_of_week : null],
        timeOfDay: [component.advancedSettings?.time_of_day ? component.advancedSettings?.time_of_day : null],
        meridiem: [null]
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
    spyOn(qbdAdvancedSettingService, 'postQbdAdvancedSettings').and.returnValue(throwError(errorResponse));
    fixture.detectChanges();
    expect(component.save()).toBeUndefined();
  });

  it('form with null data', () => {
    spyOn(qbdAdvancedSettingService, 'getQbdAdvancedSettings').and.returnValue(of(QBDAdvancedSettingResponse2));
    fixture.detectChanges();
    expect((component as any).getSettingsAndSetupForm()).toBeUndefined();
    expect((component as any).constructPayloadAndSave()).toBeUndefined();
  });

  it('getsettingsAndsetupForm fuunction check', () => {
    spyOn(qbdAdvancedSettingService, 'getQbdAdvancedSettings').and.returnValue(throwError(errorResponse));
    fixture.detectChanges();
    expect((component as any).getSettingsAndSetupForm()).toBeUndefined();
  });
});
