import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboOnboardingEmployeeSettingsComponent } from './qbo-onboarding-employee-settings.component';

describe('QboOnboardingEmployeeSettingsComponent', () => {
 let component: QboOnboardingEmployeeSettingsComponent;
 let fixture: ComponentFixture<QboOnboardingEmployeeSettingsComponent>;

 beforeEach(async () => {
   await TestBed.configureTestingModule({
     declarations: [ QboOnboardingEmployeeSettingsComponent ]
   })
   .compileComponents();

   fixture = TestBed.createComponent(QboOnboardingEmployeeSettingsComponent);
   component = fixture.componentInstance;
   fixture.detectChanges();
 });

 it('should create', () => {
   expect(component).toBeTruthy();
 });
});
