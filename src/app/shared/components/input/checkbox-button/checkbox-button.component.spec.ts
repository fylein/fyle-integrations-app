import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxButtonComponent } from './checkbox-button.component';

describe('CheckboxButtonComponent', () => {
  let component: CheckboxButtonComponent;
  let fixture: ComponentFixture<CheckboxButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
