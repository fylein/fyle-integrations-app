import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { GustoService } from 'src/app/core/services/gusto/gusto.service';
import { GustoMockConfiguration, GustoMockConfigurationPayload } from 'src/app/core/services/gusto/gusto.service.fixture';
import { orgMockData } from 'src/app/core/services/org/org.fixture';
import { OrgService } from 'src/app/core/services/org/org.service';
import { GustoComponent } from '../gusto.component';

import { GustoConfigurationComponent } from './gusto-configuration.component';

describe('GustoConfigurationComponent', () => {
  let component: GustoConfigurationComponent;
  let fixture: ComponentFixture<GustoConfigurationComponent>;
  let formBuilder: FormBuilder;
  let orgService: OrgService;
  let gustoService: GustoService;

  const service1 = {
    getCachedOrg: () => of(orgMockData)
  };

  const service2 = {
    postConfigurations: () => of(GustoMockConfigurationPayload)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GustoConfigurationComponent ],
      imports: [
        HttpClientModule, HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        MessageService,
        { provide: OrgService, useValue: service1 },
        { provide: GustoService, useValue: service2 }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GustoConfigurationComponent);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    orgService = TestBed.inject(OrgService);
    gustoService = TestBed.inject(GustoService);
    component.configurationForm = formBuilder.group({
      email: [[{name: 'shwetabh', email: "shwetabh.kumar@fylehq.com"}]],
      additionalEmails: [[{name: 'shwetabh', email: "shwetabh.kumar@fylehq.com"}]]
    });
    component.gustoConfiguration = GustoMockConfiguration;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    component.gustoConfiguration.additional_email_options = [];
    component.gustoConfiguration.emails_selected = [];
    expect(component).toBeTruthy();
  });

  it('Save function', () => {
    expect(component.save()).toBeUndefined();
    component.configurationForm.controls.email.patchValue(null);
    component.configurationForm.controls.additionalEmails.patchValue(null);
    fixture.detectChanges();
    expect(component.save()).toBeUndefined();
  });

  it('Save function with fail api', () => {
    spyOn(gustoService, 'postConfigurations').and.returnValue(throwError({}));
    expect(component.save()).toBeUndefined();
  });
});