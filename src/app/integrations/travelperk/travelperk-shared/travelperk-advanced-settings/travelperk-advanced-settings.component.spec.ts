import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelperkAdvancedSettingsComponent } from './travelperk-advanced-settings.component';

xdescribe('TravelperkAdvancedSettingsComponent', () => {
  let component: TravelperkAdvancedSettingsComponent;
  let fixture: ComponentFixture<TravelperkAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelperkAdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelperkAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
