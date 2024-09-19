import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationMappingFieldsComponent } from './configuration-mapping-fields.component';

xdescribe('ConfigurationMappingFieldsComponent', () => {
  let component: ConfigurationMappingFieldsComponent;
  let fixture: ComponentFixture<ConfigurationMappingFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationMappingFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationMappingFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
