import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { QBDConfigurationCtaText, QBDOnboardingState, QBDRepresentation } from 'src/app/core/models/enum/enum.model';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';
import { FieldMappingModel, QBDFieldMappingGet } from 'src/app/core/models/qbd/qbd-configuration/field-mapping.model';
import { QbdFieldMappingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-field-mapping.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';

@Component({
  selector: 'app-field-mapping',
  templateUrl: './field-mapping.component.html',
  styleUrls: ['./field-mapping.component.scss']
})
export class FieldMappingComponent implements OnInit {
  fieldMapping: QBDFieldMappingGet;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private fieldMappingService: QbdFieldMappingService,
    private workspaceService: QbdWorkspaceService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) { }

  isLoading: boolean;

  saveInProgress: boolean;

  fieldMappingForm: FormGroup;

  isOnboarding: boolean = true;

  ConfigurationCtaText = QBDConfigurationCtaText;

  representationOption: QBDExportSettingFormOption[] = [
    {
      label: 'Project',
      value: QBDRepresentation.PROJECT
    },
    {
      label: 'Cost Center',
      value: QBDRepresentation.COST_CENTER
    },
    {
      label: 'Select type custom field',
      value: QBDRepresentation.CUSTOME_FIELD
    }
  ];

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

  constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const fieldMappingPayload = FieldMappingModel.constructPayload(this.fieldMappingForm);

    this.fieldMappingService.postQbdFieldMapping(fieldMappingPayload).subscribe((response: QBDFieldMappingGet) => {
      this.saveInProgress = false;
      this.messageService.add({key: 'tl', severity: 'success', summary: 'Success', detail: 'Field mapping saved successfully'});
      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(QBDOnboardingState.ADVANCED_CONFIGURATION);
        this.router.navigate([`/integrations/qbd/onboarding/advanced_settings`]);
      }
    }, () => {
      this.saveInProgress = false;
      this.messageService.add({key: 'tl', severity: 'error', summary: 'Error', detail: 'Error saving field mapping, please try again later'});
      });
  }

  save(): void {
    if (this.fieldMappingForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.fieldMappingService.getQbdFieldMapping().subscribe((fielsMappingResponse : QBDFieldMappingGet) => {
      this.fieldMapping = fielsMappingResponse;
      this.fieldMappingForm = this.formBuilder.group({
        classType: [this.fieldMapping?.class_type ? this.fieldMapping?.class_type : null],
        customerType: [this.fieldMapping?.project_type ? this.fieldMapping?.project_type : null]
      });
      this.isLoading = false;
    }, () => {
        this.fieldMappingForm = this.formBuilder.group({
          classType: [null, Validators.required],
          customerType: [null, Validators.required]
        });
        this.isLoading = false;
      }
    );
  }


}
