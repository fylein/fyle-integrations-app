import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigurationCta, QBDOnboardingState, QBDFyleField, ToastSeverity, ClickEvent, Page, ProgressPhase, UpdateEvent, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';
import { FieldMappingModel, QBDFieldMappingGet } from 'src/app/core/models/qbd/qbd-configuration/field-mapping.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { QbdFieldMappingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-field-mapping.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-qbd-field-mapping',
  templateUrl: './qbd-field-mapping.component.html',
  styleUrls: ['./qbd-field-mapping.component.scss']
})
export class QbdFieldMappingComponent implements OnInit {

  isLoading: boolean;

  saveInProgress: boolean;

  fieldMappingForm: FormGroup;

  isOnboarding: boolean = true;

  ConfigurationCtaText = ConfigurationCta;

  redirectLink = brandingKbArticles.topLevelArticles.QBD;

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

  fieldMapping: QBDFieldMappingGet;

  readonly brandingConfig = brandingConfig;

  constructor(
    private router: Router,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private fieldMappingService: QbdFieldMappingService,
    private workspaceService: QbdWorkspaceService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService
  ) { }

  mappingFieldFormOptionsFunction(formControllerName: string): QBDExportSettingFormOption[] {
    return this.representationOption.filter(option => {
      return option.value !== this.fieldMappingForm.value[formControllerName];
    });
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const fieldMappingPayload = FieldMappingModel.constructPayload(this.fieldMappingForm);

    this.fieldMappingService.postQbdFieldMapping(fieldMappingPayload).subscribe((response: QBDFieldMappingGet) => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Field mapping saved successfully');
      this.trackingService.trackTimeSpent(TrackingApp.QBD, Page.FIELD_MAPPING_QBD, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === QBDOnboardingState.FIELD_MAPPINGS) {
        this.trackingService.onOnboardingStepCompletion(TrackingApp.QBD, QBDOnboardingState.FIELD_MAPPINGS, 3, fieldMappingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.QBD,
          UpdateEvent.ADVANCED_SETTINGS_QBD,
          {
            phase: this.getPhase(),
            oldState: this.fieldMapping,
            newState: response
          }
        );
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
      this.fieldMapping = fieldMappingResponse;
      this.fieldMappingForm = this.formBuilder.group({
        classType: [this.fieldMapping?.class_type ? this.fieldMapping?.class_type : null],
        customerType: [this.fieldMapping?.project_type ? this.fieldMapping?.project_type : null]
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
