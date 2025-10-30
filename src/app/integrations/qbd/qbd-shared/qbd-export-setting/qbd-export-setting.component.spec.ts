import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { QBDCorporateCreditCardExpensesObject, ExpenseState, QBDExportDateType, QBDOnboardingState, QBDReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { QbdExportSettingsService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-settings.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { QbdExportSettingComponent } from './qbd-export-setting.component';
import { errorResponse, QBDExportSettingResponse, QBDExportSettingResponse2 } from './qbd-export-setting.fixture';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-core/qbd-mapping.service';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { TranslocoService } from '@jsverse/transloco';

describe('QbdExportSettingComponent', () => {
  let component: QbdExportSettingComponent;
  let fixture: ComponentFixture<QbdExportSettingComponent>;
  let service1: any;
  let service2: any;
  let service3: any;
  let service4: any;
  let formbuilder: FormBuilder;
  let qbdWorkspaceService: QbdWorkspaceService;
  let qbdExportSettingService: QbdExportSettingsService;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(async () => {

    service1 = {
      getQbdExportSettings: () => of(QBDExportSettingResponse),
      postQbdExportSettings: () => of(QBDExportSettingResponse)
    };

    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate'], {
      config: {
        reRenderOnLangChange: true
      },
      langChanges$: of('en'),
      _loadDependencies: () => Promise.resolve()
    });

    service2 = {
      getOnboardingState: () => QBDOnboardingState.EXPORT_SETTINGS,
      setOnboardingState: () => undefined
    };

    service3 = {
      displayToastMessage: () => undefined
    };

    service4 = {
      refreshMappingPages: () => undefined
    };

    await TestBed.configureTestingModule({
    declarations: [QbdExportSettingComponent],
    imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, SharedModule, NoopAnimationsModule],
    providers: [
        FormBuilder,
        { provide: TranslocoService, useValue: translocoServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: QbdExportSettingsService, useValue: service1 },
        { provide: QbdWorkspaceService, useValue: service2 },
        { provide: IntegrationsToastService, useValue: service3 },
        { provide: QbdMappingService, useValue: service4 },
        provideHttpClient(withInterceptorsFromDi())
    ]
})
    .compileComponents();

    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;

    fixture = TestBed.createComponent(QbdExportSettingComponent);
    component = fixture.componentInstance;
    component.exportSettings = QBDExportSettingResponse;
    formbuilder = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);
    qbdWorkspaceService = TestBed.inject(QbdWorkspaceService);
    qbdExportSettingService = TestBed.inject(QbdExportSettingsService);
    component.exportSettingsForm = formbuilder.group({
      reimbursableExportType: [component.exportSettings?.reimbursable_expenses_export_type],
      reimbursableExpense: [component.exportSettings?.reimbursable_expenses_export_type ? true : false, (component as any).exportSelectionValidator()],
      reimbursableExportGroup: [component.exportSettings?.reimbursable_expense_grouped_by ? component.exportSettings?.reimbursable_expense_grouped_by : null],
      reimbursableExportDate: [component.exportSettings?.reimbursable_expense_date],
      creditCardExpense: [component.exportSettings?.credit_card_expense_export_type ? true : false, (component as any).exportSelectionValidator()],
      cccExportType: [component.exportSettings?.credit_card_expense_export_type ? component.exportSettings?.credit_card_expense_export_type : null],
      cccExportGroup: [component.exportSettings?.credit_card_expense_grouped_by ? component.exportSettings?.credit_card_expense_grouped_by : null],
      cccExportDate: [component.exportSettings?.credit_card_expense_date ? component.exportSettings?.credit_card_expense_date : null],
      bankAccount: [component.exportSettings?.bank_account_name ? component.exportSettings?.bank_account_name : null],
      mileageAccountName: [component.exportSettings?.mileage_account_name ? component.exportSettings?.mileage_account_name : null],
      cccEntityName: [component.exportSettings?.credit_card_entity_name_preference ? component.exportSettings?.credit_card_entity_name_preference : null],
      cccAccountName: [component.exportSettings?.credit_card_account_name ? component.exportSettings?.credit_card_account_name : null],
      reimbursableExpenseState: [component.exportSettings?.reimbursable_expense_state ? component.exportSettings?.reimbursable_expense_state : null],
      cccExpenseState: [component.exportSettings?.credit_card_expense_state ? component.exportSettings?.credit_card_expense_state : null]
    });
    translocoService.translate.and.callFake(<T = string>(key: string): T => {
      const translations: Record<string, string> = {
        'qbdExportSetting.creditCardPurchase': 'Credit card purchase',
        'qbdExportSetting.journalEntry': 'Journal entry',
        'qbdExportSetting.bank': 'bank'
      };

      return translations[key] as T;
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Save function check', () => {
    component.exportSettingsForm = formbuilder.group({
      reimbursableExportType: [component.exportSettings?.reimbursable_expenses_export_type],
      reimbursableExpense: [component.exportSettings?.reimbursable_expenses_export_type ? true : false, (component as any).exportSelectionValidator()],
      reimbursableExportGroup: [component.exportSettings?.reimbursable_expense_grouped_by ? component.exportSettings?.reimbursable_expense_grouped_by : null],
      reimbursableExportDate: ['spent_at'],
      creditCardExpense: [component.exportSettings?.credit_card_expense_export_type ? true : false, (component as any).exportSelectionValidator()],
      cccExportType: [component.exportSettings?.credit_card_expense_export_type ? component.exportSettings?.credit_card_expense_export_type : null],
      cccExportGroup: [component.exportSettings?.credit_card_expense_grouped_by ? component.exportSettings?.credit_card_expense_grouped_by : null],
      cccExportDate: [component.exportSettings?.credit_card_expense_date ? component.exportSettings?.credit_card_expense_date : null],
      bankAccount: [component.exportSettings?.bank_account_name ? component.exportSettings?.bank_account_name : null],
      mileageAccountName: [component.exportSettings?.mileage_account_name ? component.exportSettings?.mileage_account_name : null],
      cccEntityName: [component.exportSettings?.credit_card_entity_name_preference ? component.exportSettings?.credit_card_entity_name_preference : null],
      cccAccountName: [component.exportSettings?.credit_card_account_name ? component.exportSettings?.credit_card_account_name : null],
      reimbursableExpenseState: [component.exportSettings?.reimbursable_expense_state ? component.exportSettings?.reimbursable_expense_state : null],
      cccExpenseState: [component.exportSettings?.credit_card_expense_state ? component.exportSettings?.credit_card_expense_state : null]
    });
    expect(component.save()).toBeUndefined();
  });

  it('Save function check', () => {
    component.isOnboarding = true;
    fixture.detectChanges();
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    spyOn(qbdWorkspaceService, 'getOnboardingState').and.returnValue(QBDOnboardingState.COMPLETE);
    fixture.detectChanges();
    expect(component.save()).toBeUndefined();
    component.isOnboarding = false;
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
    fixture.detectChanges();
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
    component.exportSettingsForm.controls.creditCardExpense.patchValue(!component.exportSettingsForm.controls.creditCardExpense.value);
    expect((component as any).createCreditCardExpenseWatcher()).toBeUndefined();
    component.exportSettings.credit_card_expense_grouped_by = null;
    component.exportSettings.credit_card_expense_date = null;
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
      mileageAccountName: [component.exportSettings?.mileage_account_name ? component.exportSettings?.mileage_account_name : null],
      cccEntityName: [component.exportSettings?.credit_card_entity_name_preference ? component.exportSettings?.credit_card_entity_name_preference : null],
      cccAccountName: [component.exportSettings?.credit_card_account_name ? component.exportSettings?.credit_card_account_name : null],
      reimbursableExpenseState: [component.exportSettings?.reimbursable_expense_state ? component.exportSettings?.reimbursable_expense_state : null],
      cccExpenseState: [component.exportSettings?.credit_card_expense_state ? component.exportSettings?.credit_card_expense_state : null]
    });
    fixture.detectChanges();
    const control = { value: ExpenseState.PAID, parent: formbuilder.group({
      reimbursableExpense: QBDReimbursableExpensesObject.JOURNAL_ENTRY
    }) };
    expect((component as any).exportSelectionValidator()(control as AbstractControl)).toBeDefined();
    const control1 = { value: ExpenseState.PAYMENT_PROCESSING, parent: formbuilder.group({
      creditCardExpense: QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY
    }) };
    expect((component as any).exportSelectionValidator()(control1 as AbstractControl)).toBeNull();
  });

  it('form with null data', () => {
    spyOn(qbdExportSettingService, 'getQbdExportSettings').and.returnValue(of(QBDExportSettingResponse2));
    fixture.detectChanges();
    expect((component as any).getSettingsAndSetupForm()).toBeUndefined();
    expect((component as any).constructPayloadAndSave()).toBeUndefined();
  });

  it('accountName function check', () => {
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(QBDReimbursableExpensesObject.JOURNAL_ENTRY);
    fixture.detectChanges();
    expect(component.accountName()).toBe('bank');
    expect(component.namePreference()).toContain('Journal entry');
  });

  it('getsettingsAndsetupForm fuunction check', () => {
    spyOn(qbdExportSettingService, 'getQbdExportSettings').and.returnValue(throwError(errorResponse));
    fixture.detectChanges();
    expect((component as any).getSettingsAndSetupForm()).toBeUndefined();
  });

  it('reimbursableExpenseGroupingDateOptionsFn function check', () => {
    translocoService.translate.and.returnValue('Date of export');
    // Call ngOnInit to initialize the options
    component.ngOnInit();
    fixture.detectChanges();

    const reimbursableExpenseGroupingDateOptions: QBDExportSettingFormOption[] = [
      {
        label: 'Date of export',
        value: QBDExportDateType.LAST_SPENT_AT
      }
    ];
    expect(component.reimbursableExpenseGroupingDateOptionsFn()).toEqual(reimbursableExpenseGroupingDateOptions);
  });

  it('navigateToMapping function check', () => {
    expect(component.navigateToMapping()).toBeUndefined();
  });
});
