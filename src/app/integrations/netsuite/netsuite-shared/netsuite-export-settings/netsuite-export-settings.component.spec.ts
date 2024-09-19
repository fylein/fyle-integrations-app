import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteExportSettingsComponent } from './netsuite-export-settings.component';

xdescribe('NetsuiteExportSettingsComponent', () => {
  let component: NetsuiteExportSettingsComponent;
  let fixture: ComponentFixture<NetsuiteExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteExportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
