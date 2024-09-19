import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { Sage300AdvancedSettingsComponent } from './sage300-advanced-settings.component';

xdescribe('Sage300AdvancedSettingsComponent', () => {
  let component: Sage300AdvancedSettingsComponent;
  let fixture: ComponentFixture<Sage300AdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300AdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300AdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
