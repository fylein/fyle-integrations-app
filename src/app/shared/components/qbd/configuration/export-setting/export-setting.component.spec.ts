import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService, SharedModule } from 'primeng/api';
import { of } from 'rxjs';
import { QBDCorporateCreditCardExpensesObject, QBDExpenseState, QBDOnboardingState, QBDReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { QbdExportSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-setting.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';

import { ExportSettingComponent } from './export-setting.component';
import { QBDExportSettingResponse } from './export-setting.fixture';

describe('ExportSettingComponent', () => {
  let component: ExportSettingComponent;
  let fixture: ComponentFixture<ExportSettingComponent>;
  let service1: any;
  let service2: any;
  let formbuilder: FormBuilder;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;

  beforeEach(async () => {

    service1 = {
      getQbdExportSettings: () => of(QBDExportSettingResponse),
      postQbdExportSettings: () => of(QBDExportSettingResponse)
    };

    service2 = {
      getOnboardingState: () => QBDOnboardingState.EXPORT_SETTINGS,
      setOnboardingState: () => undefined
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule, SharedModule, NoopAnimationsModule],
      declarations: [ ExportSettingComponent ],
      providers: [
        MessageService, FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: QbdExportSettingService, useValue: service1 },
        { provide: QbdWorkspaceService, useValue: service2 }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportSettingComponent);
    component = fixture.componentInstance;
    component.exportSettings = QBDExportSettingResponse;
    formbuilder = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);
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

  it('createReimbursableExpenseWatcher function check', () => {
    component.ngOnInit();
    component.exportSettingsForm.controls.reimbursableExpense.patchValue(true);
    expect((component as any).createReimbursableExpenseWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.exportSettingsForm.controls.reimbursableExpense.patchValue(false);
    expect((component as any).createReimbursableExpenseWatcher()).toBeUndefined();
  });

  it('createCreditCardExpenseWatcher function check', () => {
    component.exportSettingsForm.controls.creditCardExpense.patchValue(!component.exportSettingsForm.controls.creditCardExpense.value);
    expect((component as any).createCreditCardExpenseWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.exportSettingsForm.controls.creditCardExpense.patchValue(!component.exportSettingsForm.controls.creditCardExpense.value);
    expect((component as any).createCreditCardExpenseWatcher()).toBeUndefined();
  });

  it('exportSelectionValidator function check', () => {
    const control = { value: QBDExpenseState.APPROVED, parent: formbuilder.group({
      reimbursableExpense: QBDReimbursableExpensesObject.BILL
    }) };
    expect((component as any).exportSelectionValidator()(control as AbstractControl)).toBeUndefined;
    const control1 = { value: QBDExpenseState.PAYMENT_PROCESSING, parent: formbuilder.group({
      creditCardExpense: QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
    }) };
    expect((component as any).exportSelectionValidator()(control1 as AbstractControl)).toBeUndefined;
  });
});
