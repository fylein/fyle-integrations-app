import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { QboEmployeeSettingsComponent } from './qbo-employee-settings.component';
import { QboEmployeeSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-employee-settings.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

describe('QboEmployeeSettingsComponent', () => {
  let component: QboEmployeeSettingsComponent;
  let fixture: ComponentFixture<QboEmployeeSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QboEmployeeSettingsComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: QboEmployeeSettingsService,
          useValue: { getEmployeeSettings: () => of({}), getDistinctQBODestinationAttributes: () => of([]) }
        },
        {
          provide: QboExportSettingsService,
          useValue: { getExportSettings: () => of({}) }
        },
        {
          provide: IntegrationsToastService,
          useValue: { displayToastMessage: () => {} }
        },
        {
          provide: WindowService,
          useValue: { nativeWindow: { location: { pathname: '/some/path' } } }
        },
        {
          provide: WorkspaceService,
          useValue: { setOnboardingState: () => {} }
        },
        {
          provide: Router,
          useValue: { navigate: () => {} }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QboEmployeeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup form on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component.employeeSettingForm).toBeDefined();
    expect(component.employeeSettingForm.controls.employeeMapping).toBeDefined();
    expect(component.employeeSettingForm.controls.autoMapEmployee).toBeDefined();
    expect(component.employeeSettingForm.controls.searchOption).toBeDefined();
  }));
});
