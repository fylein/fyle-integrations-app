import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QBDConfigurationCtaText, QBDOnboardingState, QBDFyleField, ToastSeverity, ClickEvent, Page } from 'src/app/core/models/enum/enum.model';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';
import { FieldMappingModel, QBDFieldMappingGet } from 'src/app/core/models/qbd/qbd-configuration/field-mapping.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { QbdFieldMappingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-field-mapping.service';
import { QbdToastService } from 'src/app/core/services/qbd/qbd-core/qbd-toast.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';

@Component({
  selector: 'app-field-mapping',
  templateUrl: './field-mapping.component.html',
  styleUrls: ['./field-mapping.component.scss']
})
export class FieldMappingComponent implements OnInit {

  isLoading: boolean;

  saveInProgress: boolean;

  fieldMappingForm: FormGroup;

  isOnboarding: boolean = true;

  ConfigurationCtaText = QBDConfigurationCtaText;

  representationOption: QBDExportSettingFormOption[] = [
    {
      label: 'Project',
      value: QBDFyleField.PROJECT
    },
    {
      label: 'Cost Center',
      value: QBDFyleField.COST_CENTER
    }
  ];

  private sessionStartTime = new Date();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private fieldMappingService: QbdFieldMappingService,
    private workspaceService: QbdWorkspaceService,
    private toastService: QbdToastService,
    private trackingService: TrackingService
  ) { }

  mappingFieldFormOptionsFunction(formControllerName: string): QBDExportSettingFormOption[] {
    return this.representationOption.filter(option => {
      return option.value === this.fieldMappingForm.value[formControllerName];
    });
  }

  constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const fieldMappingPayload = FieldMappingModel.constructPayload(this.fieldMappingForm);

    this.fieldMappingService.postQbdFieldMapping(fieldMappingPayload).subscribe((response: QBDFieldMappingGet) => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Field mapping saved successfully');
      if (this.workspaceService.getOnboardingState() === QBDOnboardingState.FIELD_MAPPING) {
        this.trackingService.trackTimeSpent(Page.FIELD_MAPPING_QBD, this.sessionStartTime);
        this.trackingService.onOnboardingStepCompletion(QBDOnboardingState.FIELD_MAPPING, 3, fieldMappingPayload);
      }
      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(QBDOnboardingState.ADVANCED_SETTINGS);
        this.router.navigate([`/integrations/qbd/onboarding/advanced_settings`]);
      }
    }, () => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving field mapping, please try again later');
      });
  }

  save(): void {
    if (this.fieldMappingForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  private getSettingsAndSetupForm(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');
    this.fieldMappingService.getQbdFieldMapping().subscribe((fieldMappingResponse : QBDFieldMappingGet) => {
      const fieldMapping = fieldMappingResponse;
      this.fieldMappingForm = this.formBuilder.group({
        classType: [fieldMapping?.class_type ? fieldMapping?.class_type : null],
        customerType: [fieldMapping?.project_type ? fieldMapping?.project_type : null]
      });
      this.isLoading = false;
    }, () => {
        this.fieldMappingForm = this.formBuilder.group({
          classType: [null],
          customerType: [null]
        });
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }
}
