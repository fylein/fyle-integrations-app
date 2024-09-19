import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NetsuiteImportSettingsComponent } from './netsuite-import-settings.component';

xdescribe('NetsuiteImportSettingsComponent', () => {
  let component: NetsuiteImportSettingsComponent;
  let fixture: ComponentFixture<NetsuiteImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteImportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
