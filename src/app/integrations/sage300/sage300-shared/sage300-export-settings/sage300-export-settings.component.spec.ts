import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { Sage300ExportSettingsComponent } from './sage300-export-settings.component';

xdescribe('Sage300ExportSettingsComponent', () => {
  let component: Sage300ExportSettingsComponent;
  let fixture: ComponentFixture<Sage300ExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300ExportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300ExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
