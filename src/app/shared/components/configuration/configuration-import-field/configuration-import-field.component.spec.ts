import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationImportFieldComponent } from './configuration-import-field.component';

xdescribe('ConfigurationImportFieldComponent', () => {
  let component: ConfigurationImportFieldComponent;
  let fixture: ComponentFixture<ConfigurationImportFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationImportFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationImportFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
