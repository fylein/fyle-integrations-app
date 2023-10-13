import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationAdvancedSettingsComponent } from './configuration-advanced-settings.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MessageService } from 'primeng/api';

describe('ConfigurationAdvancedSettingsComponent', () => {
  let component: ConfigurationAdvancedSettingsComponent;
  let fixture: ComponentFixture<ConfigurationAdvancedSettingsComponent>;

  beforeEach(async () => {
    const service4 = {
      displayToastMessage: () => undefined
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule],
      declarations: [ ConfigurationAdvancedSettingsComponent ],
      providers: [FormBuilder,
        {provide: IntegrationsToastService, useValue: service4}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
