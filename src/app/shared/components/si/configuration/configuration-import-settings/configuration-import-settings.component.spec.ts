import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationImportSettingsComponent } from './configuration-import-settings.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';

describe('ConfigurationImportSettingsComponent', () => {
  let component: ConfigurationImportSettingsComponent;
  let fixture: ComponentFixture<ConfigurationImportSettingsComponent>;

  beforeEach(async () => {
    const service4 = {
      displayToastMessage: () => undefined
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule],
      declarations: [ ConfigurationImportSettingsComponent ],
      providers: [FormBuilder,
        {provide: IntegrationsToastService, useValue: service4}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
