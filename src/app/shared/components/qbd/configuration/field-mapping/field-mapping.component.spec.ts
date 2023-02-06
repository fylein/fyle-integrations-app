import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService, SharedModule } from 'primeng/api';

import { FieldMappingComponent } from './field-mapping.component';

describe('FieldMappingComponent', () => {
  let component: FieldMappingComponent;
  let fixture: ComponentFixture<FieldMappingComponent>;
  let formbuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule, SharedModule, NoopAnimationsModule],
      declarations: [ FieldMappingComponent ],
      providers: [MessageService, FormBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldMappingComponent);
    component = fixture.componentInstance;
    formbuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
