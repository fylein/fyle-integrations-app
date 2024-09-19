import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ConfigurationTextFieldComponent } from './configuration-text-field.component';

xdescribe('ConfigurationTextFieldComponent', () => {
  let component: ConfigurationTextFieldComponent;
  let fixture: ComponentFixture<ConfigurationTextFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationTextFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
