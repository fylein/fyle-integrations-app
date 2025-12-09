import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sage300ImportSettingsComponent } from './sage300-import-settings.component';

xdescribe('Sage300ImportSettingsComponent', () => {
  let component: Sage300ImportSettingsComponent;
  let fixture: ComponentFixture<Sage300ImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Sage300ImportSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Sage300ImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
