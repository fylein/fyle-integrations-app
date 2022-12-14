import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { BambooHrComponent } from './bamboo-hr.component';

describe('BambooHrComponent', () => {
  let component: BambooHrComponent;
  let fixture: ComponentFixture<BambooHrComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BambooHrComponent ],
      imports: [
        HttpClientModule, HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        MessageService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BambooHrComponent);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
