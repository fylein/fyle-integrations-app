import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationCustomFieldCreationDialogComponent } from './configuration-custom-field-creation-dialog.component';

xdescribe('ConfigurationCustomFieldCreationDialogComponent', () => {
  let component: ConfigurationCustomFieldCreationDialogComponent;
  let fixture: ComponentFixture<ConfigurationCustomFieldCreationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationCustomFieldCreationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationCustomFieldCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
