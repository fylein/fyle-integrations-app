import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdMainComponent } from './qbd-main.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { QBDExportSettingResponse, QBDExportSettingResponse2 } from 'src/app/integrations/qbd/qbd-shared/qbd-export-setting/qbd-export-setting.fixture';
import { QbdExportSettingsService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-settings.service';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-core/qbd-mapping.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';

describe('QbdMainComponent', () => {
  let component: QbdMainComponent;
  let fixture: ComponentFixture<QbdMainComponent>;
  const routerSpy = { navigateByUrl: jasmine.createSpy('navigateByUrl'), url: '/path' };
  let export_settings_service: QbdExportSettingsService;

  beforeEach(async () => {
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate']);

    const service1 = {
      getQbdExportSettings: () => of(QBDExportSettingResponse),
      postQbdExportSettings: () => of(QBDExportSettingResponse)
    };

    const service2 = {
      GetMappingPagesForSideNavBar: () => of(true)
    };

    await TestBed.configureTestingModule({
    declarations: [QbdMainComponent],
    imports: [RouterTestingModule],
    providers: [
        { provide: QbdExportSettingsService, useValue: service1 },
        { provide: Router, useValue: routerSpy },
        { provide: TranslocoService, useValue: translocoServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();

    fixture = TestBed.createComponent(QbdMainComponent);
    component = fixture.componentInstance;
    export_settings_service = TestBed.inject(QbdExportSettingsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.ngOnInit()).toBeUndefined();
    spyOn(export_settings_service, 'getQbdExportSettings').and.returnValue(of(QBDExportSettingResponse2));
    expect(component.ngOnInit()).toBeUndefined();
  });
});
