import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationExportSettingsComponent } from './configuration-export-settings.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from 'src/app/shared/shared.module';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { SiExportSettingService } from 'src/app/core/services/si/si-configuration/si-export-setting.service';
import { Router } from '@angular/router';
import { IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';

describe('ConfigurationExportSettingsComponent', () => {
  let component: ConfigurationExportSettingsComponent;
  let fixture: ComponentFixture<ConfigurationExportSettingsComponent>;
  let service1: any;
  let service2: any;
  let service3: any;
  let formbuilder: FormBuilder;
  let siWorkspaceService: SiWorkspaceService;
  let siExportSettingService: SiExportSettingService;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;

  beforeEach(async () => {
    service1 = {
      getOnboardingState: () => IntacctOnboardingState.EXPORT_SETTINGS,
      setOnboardingState: () => undefined
    };

    service2 = {
      displayToastMessage: () => undefined
    };
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule, SharedModule],
      declarations: [ ConfigurationExportSettingsComponent ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: IntegrationsToastService, useValue: service3 }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
