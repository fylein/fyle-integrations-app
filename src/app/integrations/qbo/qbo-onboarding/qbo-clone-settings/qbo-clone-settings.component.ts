import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { brandingConfig } from 'src/app/branding/branding-config';
import { EmployeeSettingModel } from 'src/app/core/models/common/employee-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QBOEmployeeSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-employee-setting.model';
import { QBOOnboardingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-onboarding.model';
import { CloneSettingService } from 'src/app/core/services/common/clone-setting.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-qbo-clone-settings',
  templateUrl: './qbo-clone-settings.component.html',
  styleUrls: ['./qbo-clone-settings.component.scss']
})
export class QboCloneSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  isLoading: boolean = true;

  brandingConfig = brandingConfig;

  employeeMappingOptions: SelectFormOption[] = EmployeeSettingModel.getEmployeeFieldMappingOptions();

  autoMapEmployeeOptions: SelectFormOption[] = QBOEmployeeSettingModel.getAutoMapEmployeeOptions();

  employeeSettingForm: FormGroup;

  constructor(
    private cloneSettingService: CloneSettingService,
    private workspaceService: WorkspaceService
  ) { }

  private setupOnboardingSteps(): void {
    const onboardingSteps = new QBOOnboardingModel().getOnboardingSteps('Clone Settings', this.workspaceService.getOnboardingState());
    this.onboardingSteps.push(onboardingSteps[0]);
    this.onboardingSteps.push({
      active: false,
      completed: false,
      number: 6,
      step: 'Clone Settings',
      icon: 'advanced-setting',
      route: '/integrations/qbo/onboarding/clone_settings',
      size: {
        height: '20px',
        width: '20px'
      },
      styleClasses: ['step-name-export--text', 'step-name-advanced--icon']
    });
  }

  private setupPage(): void {
    this.setupOnboardingSteps();

    forkJoin([
      this.cloneSettingService.getCloneSettings()
    ]).subscribe(([cloneSetting]) => {
      this.employeeSettingForm = QBOEmployeeSettingModel.parseAPIResponseToFormGroup(cloneSetting.employee_mappings);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
