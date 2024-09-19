import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { IntacctC1ImportSettingsComponent } from './intacct-c1-import-settings.component';

xdescribe('IntacctC1ImportSettingsComponent', () => {
  let component: IntacctC1ImportSettingsComponent;
  let fixture: ComponentFixture<IntacctC1ImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntacctC1ImportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctC1ImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
