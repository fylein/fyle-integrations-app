import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { EmailMultiSelectFieldComponent } from './email-multi-select-field.component';
import { MessageService } from 'primeng/api';
import { AppName } from 'src/app/core/models/enum/enum.model';

xdescribe('EmailMultiSelectFieldComponent', () => {
  let component: EmailMultiSelectFieldComponent;
  let fixture: ComponentFixture<EmailMultiSelectFieldComponent>;
  let formbuilder: FormBuilder;
  let el: DebugElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailMultiSelectFieldComponent ],
      providers: [FormBuilder,  MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailMultiSelectFieldComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    formbuilder = TestBed.inject(FormBuilder);
    component.options = [{name: 'dhaarani', email: "dhaarani@fylehq.com"}];
    component.formControllerName = 'email';
    component.form = formbuilder.group({
      email: [[{name: 'shwetabh', email: "shwetabh.kumar@fylehq.com"}]],
      additionalEmails: [[{name: 'shwetabh', email: "shwetabh.kumar@fylehq.com"}]],
      search: []
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('openDialog function check', () => {
    const button = fixture.debugElement.query(By.css('.tw-cursor-pointer')).children[1];
    button.nativeElement.click();
    fixture.detectChanges();
    expect(component.showDialog).toBeTrue();
  });

  it('addemail function check', () => {
    component.addEmailForm = formbuilder.group({
      name: ['shwetabhkjj'],
      email: ["shwetabhkumar.kumar@fylehq.com"]
    });
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.save-btn'));
    button.nativeElement.click();
    fixture.detectChanges();
    expect(component.showDialog).toBeFalse();
    component.showDialog = true;
    expect(component.closeModel()).toBeUndefined();
    expect(component.showDialog).toBeFalse();
  });

  it('assignSelectedEmail function check', () => {
      expect((component as any).assignSelectedEmail([])).toBeUndefined();
  });

  it('removeEmail function check', () => {
    expect(component.removeEmail()).toBeUndefined();
    component.form = formbuilder.group({
      email: [[{name: 'shwetabh', email: "shwetabh.kumar@fylehq.com"}, {name: 'shwetabhww', email: "shwetabhoop.kumar@fylehq.com"}]],
      search: []
    });
    fixture.detectChanges();
    expect(component.removeEmail()).toBeUndefined();
  });

  it('should clear search', () => {
    const option = {
      filter: (value?: any) => 'asd',
      reset: () => 'void'
    };
    component.form.controls.search.patchValue('Ashwin');
    component.clearSearch(option);

    expect(component.form.controls.search.value).toBeNull();
  });
});