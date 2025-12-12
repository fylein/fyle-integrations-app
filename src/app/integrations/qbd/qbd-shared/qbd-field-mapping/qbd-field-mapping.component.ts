import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigurationCta, QBDOnboardingState, QBDFyleField, ToastSeverity, ClickEvent, Page, ProgressPhase, UpdateEvent, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { QBDFieldMappingModel, QBDFieldMappingGet } from 'src/app/core/models/qbd/qbd-configuration/qbd-field-mapping.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { QbdFieldMappingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-field-mapping.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { forkJoin } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-qbd-field-mapping',
    templateUrl: './qbd-field-mapping.component.html',
    styleUrls: ['./qbd-field-mapping.component.scss'],
    standalone: false
})
export class QbdFieldMappingComponent implements OnInit {

  isLoading: boolean;

  saveInProgress: boolean;

  fieldMappingForm: FormGroup;

  isOnboarding: boolean = true;

  ConfigurationCtaText = ConfigurationCta;

  redirectLink = brandingKbArticles.topLevelArticles.QBD;

  representationOption: QBDExportSettingFormOption[];

  additionalOptionsItemType: QBDExportSettingFormOption[] = [];

  private sessionStartTime = new Date();

  fieldMapping: QBDFieldMappingGet;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private fieldMappingService: QbdFieldMappingService,
    private workspaceService: QbdWorkspaceService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private translocoService: TranslocoService
  ) { }

  mappingFieldFormOptionsFunction(formControllerName1: string, formControllerName2: string): QBDExportSettingFormOption[] {
    const filteredOptions = this.representationOption.filter(option => {
      return option.value !== this.fieldMappingForm.get([formControllerName1])?.value &&
             option.value !== this.fieldMappingForm.get([formControllerName2])?.value;
    });

    if (formControllerName1==='customerType' && formControllerName2==='classType'){
      filteredOptions.push(...this.additionalOptionsItemType);
    }

    return filteredOptions;
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const fieldMappingPayload = QBDFieldMappingModel.constructPayload(this.fieldMappingForm);

    this.fieldMappingService.postQbdFieldMapping(fieldMappingPayload).subscribe((response: QBDFieldMappingGet) => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('qbdFieldMapping.fieldMappingSuccess'));
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
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qbdFieldMapping.fieldMappingError'));
      });
  }

  save(): void {
    if (this.fieldMappingForm.valid) {
      this.constructPayloadAndSave();
    }
  }


  buildCustomFieldOptions(options: string[]): QBDExportSettingFormOption[] {
    return options.map((label) => {
      return {
        label,
        value: label
      };
    });
  }

  private getSettingsAndSetupForm(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');
    this.fieldMappingService.getQbdFieldMapping().subscribe((fieldMappingResponse : QBDFieldMappingGet) => {
      this.fieldMapping = fieldMappingResponse;
      this.additionalOptionsItemType = this.buildCustomFieldOptions(fieldMappingResponse.custom_fields);
      this.fieldMappingForm = this.formBuilder.group({
        classType: [this.fieldMapping?.class_type ? this.fieldMapping?.class_type : null],
        customerType: [this.fieldMapping?.project_type ? this.fieldMapping?.project_type : null],
        itemType: [this.fieldMapping?.item_type ? this.fieldMapping?.item_type : null]
      });
      this.isLoading = false;
    }, () => {
        this.fieldMappingForm = this.formBuilder.group({
          classType: [null],
          customerType: [null],
          itemType: [null]
        });
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.representationOption = [
      {
        label: this.translocoService.translate('qbdFieldMapping.project'),
        value: QBDFyleField.PROJECT
      },
      {
        label: this.translocoService.translate('qbdFieldMapping.costCenter'),
        value: QBDFyleField.COST_CENTER
      }
    ];
    this.getSettingsAndSetupForm();
  }
}
