import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { ConfigurationMultiSelectComponent } from './configuration-multi-select.component';

describe('ConfigurationMultiSelectComponent', () => {
  let component: ConfigurationMultiSelectComponent;
  let fixture: ComponentFixture<ConfigurationMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationMultiSelectComponent ],
      providers: [FormBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
