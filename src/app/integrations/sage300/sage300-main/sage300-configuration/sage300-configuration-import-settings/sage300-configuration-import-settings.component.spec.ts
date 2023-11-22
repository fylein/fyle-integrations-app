import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sage300ConfigurationImportSettingsComponent } from './sage300-configuration-import-settings.component';

describe('Sage300ConfigurationImportSettingsComponent', () => {
  let component: Sage300ConfigurationImportSettingsComponent;
  let fixture: ComponentFixture<Sage300ConfigurationImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300ConfigurationImportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300ConfigurationImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
