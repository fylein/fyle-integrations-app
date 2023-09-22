import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { QBDExportSettingResponse, QBDExportSettingResponse2 } from 'src/app/shared/components/qbd/configuration/export-setting/export-setting.fixture';
import { QbdExportSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-setting.service';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  const routerSpy = { navigateByUrl: jasmine.createSpy('navigateByUrl'), url: '/path' };
  let export_settings_service: QbdExportSettingService;

  beforeEach(async () => {
    const service1 = {
      getQbdExportSettings: () => of(QBDExportSettingResponse),
      postQbdExportSettings: () => of(QBDExportSettingResponse)
    };

    // Let service2 = {
    //   GetMappingPagesForSideNavBar: () => of(true)
    // }

    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      declarations: [ MainComponent ],
      providers: [
        { provide: QbdExportSettingService, useValue: service1 },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    export_settings_service = TestBed.inject(QbdExportSettingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.ngOnInit()).toBeUndefined();
    spyOn(export_settings_service, 'getQbdExportSettings').and.returnValue(of(QBDExportSettingResponse2));
    expect(component.ngOnInit()).toBeUndefined();
  });
});
