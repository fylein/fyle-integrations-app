import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { QboExportSettingsComponent } from './qbo-export-settings.component';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WindowService } from 'src/app/core/services/common/window.service';

describe('QboExportSettingsComponent', () => {
  let component: QboExportSettingsComponent;
  let fixture: ComponentFixture<QboExportSettingsComponent>;
  let qboExportSettingsService: QboExportSettingsService;
  let workspaceService: WorkspaceService;
  let mappingService: MappingService;
  let helperService: HelperService;
  let integrationsToastService: IntegrationsToastService;
  let windowService: WindowService;

  beforeEach(async () => {
 await TestBed.configureTestingModule({
imports: [ReactiveFormsModule, RouterTestingModule],
declarations: [QboExportSettingsComponent],
providers: [
  { provide: QboExportSettingsService, useValue: {} },
  { provide: WorkspaceService, useValue: {} },
  { provide: MappingService, useValue: {} },
  { provide: HelperService, useValue: {} },
  { provide: IntegrationsToastService, useValue: {} },
  { provide: WindowService, useValue: {} }
]
 })
  .compileComponents();
  });

  beforeEach(() => {
 fixture = TestBed.createComponent(QboExportSettingsComponent);
 component = fixture.componentInstance;
 qboExportSettingsService = TestBed.inject(QboExportSettingsService);
 workspaceService = TestBed.inject(WorkspaceService);
 mappingService = TestBed.inject(MappingService);
 helperService = TestBed.inject(HelperService);
 integrationsToastService = TestBed.inject(IntegrationsToastService);
 windowService = TestBed.inject(WindowService);
  });

  it('should create', () => {
 expect(component).toBeTruthy();
  });

  it('should call constructPayloadAndSave when save is called', () => {
  spyOn(component, 'constructPayloadAndSave');
  component.save();
  expect(component.constructPayloadAndSave).toHaveBeenCalledTimes(1);
  });

  it('should call navigateToPreviousStep when navigateToPreviousStep is called', () => {
  spyOn(component, 'navigateToPreviousStep');
  component.navigateToPreviousStep();
  expect(component.navigateToPreviousStep).toHaveBeenCalledTimes(1);
  });
});
