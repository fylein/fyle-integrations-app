import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryFieldComponent } from './mandatory-field.component';

describe('MandatoryFieldComponent', () => {
  let component: MandatoryFieldComponent;
  let fixture: ComponentFixture<MandatoryFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MandatoryFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MandatoryFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
