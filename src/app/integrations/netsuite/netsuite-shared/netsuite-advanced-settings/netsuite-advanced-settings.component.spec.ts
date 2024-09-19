import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NetsuiteAdvancedSettingsComponent } from './netsuite-advanced-settings.component';

xdescribe('NetsuiteAdvancedSettingsComponent', () => {
  let component: NetsuiteAdvancedSettingsComponent;
  let fixture: ComponentFixture<NetsuiteAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteAdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
