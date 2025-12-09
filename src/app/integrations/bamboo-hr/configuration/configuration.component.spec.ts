import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import {
  bambooHRMockConfiguration,
  bambooHRMockConfigurationPayload,
} from 'src/app/core/services/bamboo-hr/bamboo-hr.fixture';
import { orgMockData } from 'src/app/core/services/org/org.fixture';
import { OrgService } from 'src/app/core/services/org/org.service';

import { ConfigurationComponent } from './configuration.component';

xdescribe('ConfigurationComponent', () => {
  let component: ConfigurationComponent;
  let fixture: ComponentFixture<ConfigurationComponent>;
  let formBuilder: FormBuilder;
  let orgService: OrgService;

  const service1 = {
    getCachedOrg: () => orgMockData,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigurationComponent],
      imports: [],
      providers: [
        FormBuilder,
        { provide: OrgService, useValue: service1 },
        provideHttpClient(withInterceptorsFromDi()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurationComponent);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    orgService = TestBed.inject(OrgService);
    component.additionalEmails = bambooHRMockConfigurationPayload.additional_email_options;
    component.bambooHrConfiguration = bambooHRMockConfiguration;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog', () => {
    component.showDialog = false;
    component.openDialog();

    expect(component.showDialog).toBeTrue();
  });

  it('should watch for email selection changes', () => {
    expect(component.selectedEmail).toBe('ashwin.t+lolooi@fyle.in');

    component.cofigurationForm.controls.emails.patchValue([]);

    expect(component.selectedEmail).toBeNull();
  });

  it('should save configurations', () => {
    component.cofigurationForm.controls.additionalEmails.patchValue(null);
    fixture.detectChanges();
    spyOn(component.updateConfiguration, 'emit');

    component.saveSettings();
    expect(component.updateConfiguration.emit).toHaveBeenCalled();

    component.cofigurationForm.controls.additionalEmails.patchValue([]);
    fixture.detectChanges();

    component.saveSettings();
    expect(component.updateConfiguration.emit).toHaveBeenCalled();
  });

  it('should add email', () => {
    component.showDialog = true;
    component.addEmailForm.controls.email.patchValue('ashwin.t+new@fyle.in');
    component.addEmailForm.controls.name.patchValue('Ashwin New');
    component.addEmail();

    expect(component.showDialog).toBeFalse();

    const selectedEmails = component.cofigurationForm.get('emails')?.value;

    const newEmail = selectedEmails.filter((email: any) => email.email === 'ashwin.t+new@fyle.in');
    expect(newEmail.length).toBe(1);
    fixture.detectChanges();
  });

  it('should remove email', () => {
    fixture.detectChanges();
    component.cofigurationForm.controls.emails.patchValue([
      {
        email: 'ashwin.t+huha@fyle.in',
        name: 'Ashwin',
      },
      {
        email: 'ashwin.t+heha@fyle.in',
        name: 'Ashwin 2',
      },
    ]);
    component.removeEmail();

    expect(component.selectedEmail).toBe('ashwin.t+heha@fyle.in');

    component.removeEmail();

    expect(component.selectedEmail).toBeNull();
  });

  it('should clear search', () => {
    const option = {
      filter: (value?: any) => 'asd',
      reset: () => 'void',
    };
    component.cofigurationForm.controls.search.patchValue('Ashwin');
    component.clearSearch(option);

    expect(component.cofigurationForm.controls.search.value).toBeNull();
  });
});
