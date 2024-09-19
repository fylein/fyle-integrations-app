import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdMainComponent } from './qbd-main.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { QBDExportSettingResponse, QBDExportSettingResponse2 } from 'src/app/integrations/qbd/qbd-shared/qbd-export-setting/qbd-export-setting.fixture';
import { QbdExportSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-setting.service';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('QbdMainComponent', () => {
  let component: QbdMainComponent;
  let fixture: ComponentFixture<QbdMainComponent>;
  const routerSpy = { navigateByUrl: jasmine.createSpy('navigateByUrl'), url: '/path' };
  let export_settings_service: QbdExportSettingService;

  beforeEach(async () => {
    const service1 = {
      getQbdExportSettings: () => of(QBDExportSettingResponse),
      postQbdExportSettings: () => of(QBDExportSettingResponse)
    };

    const service2 = {
      GetMappingPagesForSideNavBar: () => of(true)
    };

    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      declarations: [ QbdMainComponent ],
      providers: [
        { provide: QbdExportSettingService, useValue: service1 },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdMainComponent);
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
