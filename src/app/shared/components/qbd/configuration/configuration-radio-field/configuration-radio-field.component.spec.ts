import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationRadioFieldComponent } from './configuration-radio-field.component';

describe('ConfigurationRadioFieldComponent', () => {
  let component: ConfigurationRadioFieldComponent;
  let fixture: ComponentFixture<ConfigurationRadioFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationRadioFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationRadioFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
