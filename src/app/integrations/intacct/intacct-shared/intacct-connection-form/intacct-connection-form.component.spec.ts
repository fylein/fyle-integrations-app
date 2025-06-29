import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { IntacctConnectionFormComponent } from './intacct-connection-form.component';

describe('IntacctConnectionFormComponent', () => {
  let component: IntacctConnectionFormComponent;
  let fixture: ComponentFixture<IntacctConnectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntacctConnectionFormComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctConnectionFormComponent);
    component = fixture.componentInstance;

    const formBuilder = new FormBuilder();
    component.connectIntacctForm = formBuilder.group({
      companyID: [''],
      userID: [''],
      userPassword: ['']
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});