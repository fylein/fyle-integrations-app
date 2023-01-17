import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailMultiSelectFieldComponent } from './email-multi-select-field.component';

describe('EmailMultiSelectFieldComponent', () => {
  let component: EmailMultiSelectFieldComponent;
  let fixture: ComponentFixture<EmailMultiSelectFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailMultiSelectFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailMultiSelectFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
