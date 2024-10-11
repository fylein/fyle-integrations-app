import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { EmployeeSettingModel } from 'src/app/core/models/common/employee-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ConfigurationCta, EmployeeFieldMapping, FyleField, QBOOnboardingState, QBOReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { QBOEmployeeSettingGet, QBOEmployeeSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-employee-setting.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboEmployeeSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-employee-settings.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';

@Component({
  selector: 'app-qbo-employee-settings',
  templateUrl: './qbo-employee-settings.component.html',
  styleUrls: ['./qbo-employee-settings.component.scss']
})
export class QboEmployeeSettingsComponent implements OnInit {

  isLoading: boolean = true;

  redirectLink: string = brandingKbArticles.onboardingArticles.QBO.EMPLOYEE_SETTING;

  employeeSettingForm: FormGroup;

  employeeMappingOptions: SelectFormOption[] = EmployeeSettingModel.getEmployeeFieldMappingOptions();

  autoMapEmployeeOptions: SelectFormOption[] = QBOEmployeeSettingModel.getAutoMapEmployeeOptions();

  isOnboarding: boolean;

  windowReference: Window;

  employeeSetting: QBOEmployeeSettingGet;

  existingEmployeeFieldMapping: EmployeeFieldMapping;

  liveEntityExample: {[FyleField.EMPLOYEE]: string | undefined, [FyleField.VENDOR]: string | undefined};

  reimbursableExportType: QBOReimbursableExpensesObject | null;

  isSaveInProgress: boolean = false;

  isConfirmationDialogVisible: boolean = false;

  warningDialogText: string;

  ConfigurationCtaText = ConfigurationCta;

  readonly brandingConfig = brandingConfig;

  constructor(
    private employeeSettingService: QboEmployeeSettingsService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private exportSettingService: QboExportSettingsService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/qbo/onboarding/connector`]);
  }

  save(): void {
    if (this.employeeSettingForm.valid && !this.isSaveInProgress) {
      if (this.exportSettingAffected()) {
        // Show warning dialog
        const existingEmployeeFieldMapping = this.existingEmployeeFieldMapping?.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
        const updatedEmployeeFieldMapping = this.employeeSettingForm.get('employeeMapping')?.value?.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase());

        this.warningDialogText = `You are changing your employee representation from <b>${existingEmployeeFieldMapping}</b> to <b>${updatedEmployeeFieldMapping}</b>
         <br><br>This will impact the configuration in the <b>Export settings</b> on How the export of expenses
         can be exported from ${brandingConfig.brandName} to QuickBooks Online.<br><br>
         Would you like to continue? If yes, you will be redirected to <b>Export settings</b> to revisit the configuration and complete it.`;
        this.isConfirmationDialogVisible = true;
        return;
      }
      this.constructPayloadAndSave();
    }
  }

  acceptWarning(data: ConfigurationWarningOut): void {
    this.isConfirmationDialogVisible = false;
    if (data.hasAccepted) {
      this.constructPayloadAndSave();
    }
  }

  private constructPayloadAndSave(): void {
    const employeeSettingPayload = QBOEmployeeSettingModel.constructPayload(this.employeeSettingForm);
    this.isSaveInProgress = true;

    this.employeeSettingService.postEmployeeSettings(employeeSettingPayload).subscribe(() => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Employee settings saved successfully');
      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(QBOOnboardingState.EXPORT_SETTINGS);
        this.router.navigate(['/integrations/qbo/onboarding/export_settings']);
      } else if (this.exportSettingAffected()) {
        this.router.navigate(['/integrations/qbo/main/configuration/export_settings']);
      }
    }, (error) => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving employee settings, please try again later');
    });
  }

  private exportSettingAffected(): boolean | undefined {
    return this.existingEmployeeFieldMapping && this.existingEmployeeFieldMapping !== this.employeeSettingForm.get('employeeMapping')?.value;
  }

  private setLiveEntityExample(destinationAttributes: DestinationAttribute[]): void {
    this.liveEntityExample = {
      [FyleField.EMPLOYEE]: destinationAttributes.find((attribute: DestinationAttribute) => attribute.attribute_type === FyleField.EMPLOYEE)?.value,
      [FyleField.VENDOR]: destinationAttributes.find((attribute: DestinationAttribute) => attribute.attribute_type === FyleField.VENDOR)?.value
    };
  }

  private setupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');

    forkJoin([
      this.employeeSettingService.getEmployeeSettings(),
      this.employeeSettingService.getDistinctQBODestinationAttributes([FyleField.EMPLOYEE, FyleField.VENDOR]),
      this.exportSettingService.getExportSettings()
    ]).subscribe((responses) => {
      this.employeeSetting = responses[0];
      this.existingEmployeeFieldMapping = responses[0].workspace_general_settings?.employee_field_mapping;
      this.setLiveEntityExample(responses[1]);
      this.employeeSettingForm = this.formBuilder.group({
        employeeMapping: [this.existingEmployeeFieldMapping, Validators.required],
        autoMapEmployee: [responses[0].workspace_general_settings?.auto_map_employees],
        searchOption: ['']
      });
      this.reimbursableExportType = responses[2].workspace_general_settings?.reimbursable_expenses_object;
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupForm();
  }

}
