import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationToggleFieldComponent } from './configuration-toggle-field.component';

xdescribe('ConfigurationToggleFieldComponent', () => {
  let component: ConfigurationToggleFieldComponent;
  let fixture: ComponentFixture<ConfigurationToggleFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationToggleFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationToggleFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
