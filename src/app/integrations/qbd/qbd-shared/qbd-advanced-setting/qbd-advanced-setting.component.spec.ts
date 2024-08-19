//// import { HttpClientModule } from '@angular/common/http';
//// import { ComponentFixture, TestBed } from '@angular/core/testing';
//// import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
//// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
//// import { Router } from '@angular/router';
//// import { RouterTestingModule } from '@angular/router/testing';
//
//// import { of, throwError } from 'rxjs';
//// import { QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
//// import { OrgService } from 'src/app/core/services/org/org.service';
//// import { QbdAdvancedSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-advanced-setting.service';
//// import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
//// import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';
//// import { SharedModule } from 'src/app/shared/shared.module';
//
//// import { QbdAdvancedSettingComponent } from './qbd-advanced-setting.component';
//// import { errorResponse, QBDAdvancedSettingResponse, QBDAdvancedSettingResponse2, QBDEmailOptioResponse } from './qbd-advanced-setting.fixture';
//
//// describe('QbdAdvancedSettingComponent', () => {
////   let component: QbdAdvancedSettingComponent;
////   let fixture: ComponentFixture<QbdAdvancedSettingComponent>;
////   let service1: any;
////   let service2: any;
////   let service3: any;
////   let service4: any;
////   let formbuilder: FormBuilder;
////   let qbdAdvancedSettingService: QbdAdvancedSettingService;
////   let qbdWorkspaceService: QbdWorkspaceService;
////   const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
////   let router: Router;
////   beforeEach(async () => {
////     service1 = {
////       getQbdAdvancedSettings: () => of(QBDAdvancedSettingResponse),
////       postQbdAdvancedSettings: () => of(QBDAdvancedSettingResponse)
////     };
//
////     service2 = {
////       getOnboardingState: () => QBDOnboardingState.ADVANCED_SETTINGS,
////       setOnboardingState: () => undefined
////     };
//
////     service3 = {
////       getAdditionalEmails: () => of(QBDEmailOptioResponse)
////     };
//
////     service4 = {
////       displayToastMessage: () => undefined
////     };
//
////     await TestBed.configureTestingModule({
////       imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule, SharedModule, NoopAnimationsModule],
////       declarations: [ QbdAdvancedSettingComponent ],
////       providers: [
////         FormBuilder,
////         { provide: Router, useValue: routerSpy },
////         { provide: QbdAdvancedSettingService, useValue: service1 },
////         { provide: QbdWorkspaceService, useValue: service2 },
////         { provide: OrgService, useValue: service3 },
////         { provide: IntegrationsToastService, useValue: service4 }
////       ]
////     })
////     .compileComponents();
//
////     fixture = TestBed.createComponent(QbdAdvancedSettingComponent);
////     component = fixture.componentInstance;
////     formbuilder = TestBed.inject(FormBuilder);
////     router = TestBed.inject(Router);
////     qbdWorkspaceService = TestBed.inject(QbdWorkspaceService);
////     qbdAdvancedSettingService = TestBed.inject(QbdAdvancedSettingService);
////     component.advancedSettings = QBDAdvancedSettingResponse;
////     component.memoStructure = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];
////     component.advancedSettingsForm = formbuilder.group({
////       expenseMemoStructure: [component.advancedSettings?.expense_memo_structure.length>0 ? component.advancedSettings?.expense_memo_structure : null],
////         topMemoStructure: [component.advancedSettings?.top_memo_structure ? component.advancedSettings?.top_memo_structure : null],
////         exportSchedule: [component.advancedSettings?.schedule_is_enabled ? component.advancedSettings?.schedule_is_enabled : null],
////         email: [component.advancedSettings?.emails_selected ? component.advancedSettings?.emails_selected : null],
////         frequency: [component.advancedSettings?.frequency ? component.advancedSettings?.frequency : null],
////         dayOfMonth: [component.advancedSettings?.day_of_month ? component.advancedSettings?.day_of_month : null],
////         dayOfWeek: [component.advancedSettings?.day_of_week ? component.advancedSettings?.day_of_week : null],
////         timeOfDay: [component.advancedSettings?.time_of_day ? component.advancedSettings?.time_of_day : null],
////         meridiem: [null]
////     });
////     fixture.detectChanges();
////   });
//
////   it('should create', () => {
////     expect(component).toBeTruthy();
////     component.advancedSettingsForm.controls.expenseMemoStructure.patchValue(['brande']);
////     component.advancedSettingsForm.controls.frequency.patchValue('WEEKLY');
////     component.advancedSettingsForm.controls.exportSchedule.patchValue(false);
////     expect((component as any).createMemoStructureWatcher()).toBeUndefined();
////     expect((component as any).frequencyWatcher()).toBeUndefined();
////     expect((component as any).scheduledWatcher()).toBeUndefined();
////     component.advancedSettingsForm.controls.frequency.patchValue('MONTHLY');
////     component.advancedSettingsForm.controls.exportSchedule.patchValue(true);
////     expect((component as any).frequencyWatcher()).toBeUndefined();
////     expect((component as any).scheduledWatcher()).toBeUndefined();
////   });
//
////   it('Save function check', () => {
////     expect(component.save()).toBeUndefined();
////   });
//
////   it('Save function check', () => {
////     component.isOnboarding = true;
////     fixture.detectChanges();
////     expect(component.save()).toBeUndefined();
////     component.advancedSettingsForm.controls.meridiem.patchValue('AM');
////     component.advancedSettingsForm.controls.timeOfDay.patchValue('01:00');
////     fixture.detectChanges();
////     expect(component.save()).toBeUndefined();
////     component.advancedSettingsForm.controls.meridiem.patchValue('PM');
////     fixture.detectChanges();
////     expect(component.save()).toBeUndefined();
////     component.advancedSettingsForm.controls.meridiem.patchValue('PM');
////     component.advancedSettingsForm.controls.timeOfDay.patchValue('12:00');
////     fixture.detectChanges();
////     expect(component.save()).toBeUndefined();
////     component.advancedSettingsForm.controls.meridiem.patchValue('AM');
////     component.advancedSettingsForm.controls.timeOfDay.patchValue('10:00');
////     fixture.detectChanges();
////     expect(component.save()).toBeUndefined();
////     component.advancedSettingsForm.controls.meridiem.patchValue('AM');
////     component.advancedSettingsForm.controls.timeOfDay.patchValue('12:00');
////     fixture.detectChanges();
////     expect(component.save()).toBeUndefined();
////     spyOn(qbdWorkspaceService, 'getOnboardingState').and.returnValue(QBDOnboardingState.COMPLETE);
////     fixture.detectChanges();
////     expect(component.save()).toBeUndefined();
////     component.isOnboarding = false;
////     expect(component.save()).toBeUndefined();
////   });
//
////   it('Save function check with failed api response', () => {
////     component.isOnboarding = true;
////     spyOn(qbdAdvancedSettingService, 'postQbdAdvancedSettings').and.returnValue(throwError(errorResponse));
////     fixture.detectChanges();
////     expect(component.save()).toBeUndefined();
////   });
//
////   it('form with null data', () => {
////     spyOn(qbdAdvancedSettingService, 'getQbdAdvancedSettings').and.returnValue(of(QBDAdvancedSettingResponse2));
////     fixture.detectChanges();
////     expect((component as any).getSettingsAndSetupForm()).toBeUndefined();
////     expect((component as any).constructPayloadAndSave()).toBeUndefined();
////     component.advancedSettingsForm.controls.expenseMemoStructure.patchValue([]);
////     component.advancedSettingsForm.controls.topMemoStructure.patchValue([]);
////     expect((component as any).constructPayloadAndSave()).toBeUndefined();
////   });
//
////   it('getsettingsAndsetupForm fuunction check', () => {
////     spyOn(qbdAdvancedSettingService, 'getQbdAdvancedSettings').and.returnValue(throwError(errorResponse));
////     fixture.detectChanges();
////     expect((component as any).getSettingsAndSetupForm()).toBeUndefined();
////     component.advancedSettings.time_of_day = "09:00:00";
////     fixture.detectChanges();
////     expect((component as any).getSettingsAndSetupForm()).toBeUndefined();
////     component.advancedSettings.time_of_day = "19:00:00";
////     fixture.detectChanges();
////     expect((component as any).getSettingsAndSetupForm()).toBeUndefined();
////     component.advancedSettings.time_of_day = "22:00:00";
////     fixture.detectChanges();
////     expect((component as any).getSettingsAndSetupForm()).toBeUndefined();
////     component.advancedSettings.time_of_day = "00:00:00";
////     fixture.detectChanges();
////     expect((component as any).getSettingsAndSetupForm()).toBeUndefined();
////   });
//
//// });
