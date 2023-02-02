import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService, SharedModule } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { QBDCorporateCreditCardExpensesObject, QBDExpenseState, QBDOnboardingState, QBDReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { QbdExportSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-setting.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';

import { ExportSettingComponent } from './export-setting.component';
import { errorResponse, QBDExportSettingResponse } from './export-setting.fixture';

describe('ExportSettingComponent', () => {
  let component: ExportSettingComponent;
  let fixture: ComponentFixture<ExportSettingComponent>;
  let service1: any;
  let service2: any;
  let formbuilder: FormBuilder;
  let qbdExportSettingService: QbdExportSettingService;
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
    qbdExportSettingService = TestBed.inject(QbdExportSettingService);
    component.exportSettingsForm = formbuilder.group({
      reimbursableExportType: [component.exportSettings?.reimbursable_expenses_export_type],
      reimbursableExpense: [component.exportSettings?.reimbursable_expenses_export_type ? true : false, (component as any).exportSelectionValidator()],
      reimbursableExportGroup: [component.exportSettings?.reimbursable_expense_grouped_by ? component.exportSettings?.reimbursable_expense_grouped_by : null],
      reimbursableExportDate: [component.exportSettings?.reimbursable_expense_date ? component.exportSettings?.reimbursable_expense_date : null],
      creditCardExpense: [component.exportSettings?.credit_card_expense_export_type ? true : false, (component as any).exportSelectionValidator()],
      cccExportType: [component.exportSettings?.credit_card_expense_export_type ? component.exportSettings?.credit_card_expense_export_type : null],
      cccExportGroup: [component.exportSettings?.credit_card_expense_grouped_by ? component.exportSettings?.credit_card_expense_grouped_by : null],
      cccExportDate: [component.exportSettings?.credit_card_expense_date ? component.exportSettings?.credit_card_expense_date : null],
      bankAccount: [component.exportSettings?.bank_account_name ? component.exportSettings?.bank_account_name : null],
      cccEntityName: [component.exportSettings?.credit_card_entity_name_preference ? component.exportSettings?.credit_card_entity_name_preference : null],
      cccAccountName: [component.exportSettings?.credit_card_account_name ? component.exportSettings?.credit_card_account_name : null],
      reimbursableExpenseState: [component.exportSettings?.reimbursable_expense_state ? component.exportSettings?.reimbursable_expense_state : null],
      cccExpenseState: [component.exportSettings?.credit_card_expense_state ? component.exportSettings?.credit_card_expense_state : null]
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
    spyOn(qbdExportSettingService, 'postQbdExportSettings').and.returnValue(throwError(errorResponse));
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
    component.exportSettingsForm = formbuilder.group({
      reimbursableExportType: [component.exportSettings?.reimbursable_expenses_export_type],
      reimbursableExpense: [component.exportSettings?.reimbursable_expenses_export_type ? true : false, (component as any).exportSelectionValidator()],
      reimbursableExportGroup: [component.exportSettings?.reimbursable_expense_grouped_by ? component.exportSettings?.reimbursable_expense_grouped_by : null],
      reimbursableExportDate: [component.exportSettings?.reimbursable_expense_date ? component.exportSettings?.reimbursable_expense_date : null],
      creditCardExpense: [component.exportSettings?.credit_card_expense_export_type ? true : false, (component as any).exportSelectionValidator()],
      cccExportType: [component.exportSettings?.credit_card_expense_export_type ? component.exportSettings?.credit_card_expense_export_type : null],
      cccExportGroup: [component.exportSettings?.credit_card_expense_grouped_by ? component.exportSettings?.credit_card_expense_grouped_by : null],
      cccExportDate: [component.exportSettings?.credit_card_expense_date ? component.exportSettings?.credit_card_expense_date : null],
      bankAccount: [component.exportSettings?.bank_account_name ? component.exportSettings?.bank_account_name : null],
      cccEntityName: [component.exportSettings?.credit_card_entity_name_preference ? component.exportSettings?.credit_card_entity_name_preference : null],
      cccAccountName: [component.exportSettings?.credit_card_account_name ? component.exportSettings?.credit_card_account_name : null],
      reimbursableExpenseState: [component.exportSettings?.reimbursable_expense_state ? component.exportSettings?.reimbursable_expense_state : null],
      cccExpenseState: [component.exportSettings?.credit_card_expense_state ? component.exportSettings?.credit_card_expense_state : null]
    });
    fixture.detectChanges();
    const control = { value: QBDExpenseState.PAID, parent: formbuilder.group({
      reimbursableExpense: QBDReimbursableExpensesObject.JOURNAL_ENTRY
    }) };
    expect((component as any).exportSelectionValidator()(control as AbstractControl)).toBeDefined();
    const control1 = { value: QBDExpenseState.PAYMENT_PROCESSING, parent: formbuilder.group({
      creditCardExpense: QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY
    }) };
    expect((component as any).exportSelectionValidator()(control1 as AbstractControl)).toBeNull();
  });
});
