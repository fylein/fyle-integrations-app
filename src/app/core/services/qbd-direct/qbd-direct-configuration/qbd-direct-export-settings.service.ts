import { EventEmitter, Injectable, Output } from '@angular/core';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable } from 'rxjs';
import { QbdDirectExportSettingGet, QbdDirectExportSettingModel, QbdDirectExportSettingsPost } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';
import { ExportModuleRule } from 'src/app/core/models/common/export-settings.model';
import { FormGroup } from '@angular/forms';
import { HelperUtility } from 'src/app/core/models/common/helper.model';

@Injectable({
  providedIn: 'root'
})
export class QbdDirectExportSettingsService {

  mandatoryFormController: string[];

  @Output() creditCardExportTypeChange: EventEmitter<string> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  getQbdExportSettings(): Observable<QbdDirectExportSettingGet>{
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postQbdExportSettings(exportSettingsPayload: QbdDirectExportSettingsPost): Observable<QbdDirectExportSettingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }

  setupDynamicValidators(form: FormGroup, values: ExportModuleRule, selectedValue: string): void {
    Object.entries(values.requiredValue).forEach(([key, value]) => {
      if (key === selectedValue) {
        value.forEach((formController: string) => {
          if (values.formController === 'creditCardExportType') {
            this.creditCardExportTypeChange.emit(selectedValue);
          }

          const isFieldMandatory = QbdDirectExportSettingModel.getMandatoryField(form, formController);
          if (isFieldMandatory) {
            this.mandatoryFormController.push(formController);
            HelperUtility.markControllerAsRequired(form, formController);
          } else {
            HelperUtility.clearValidatorAndResetValue(form, formController);
          }
        });
      } else {
        value.forEach((formController: string) => {
          if (!this.mandatoryFormController.includes(formController)) {
            HelperUtility.clearValidatorAndResetValue(form, formController);
          }
        });
      }
    });
  }


  setExportTypeValidatorsAndWatchers(exportTypeValidatorRule: ExportModuleRule[], form: FormGroup): void {
    Object.values(exportTypeValidatorRule).forEach((values) => {
      form.controls[values.formController].valueChanges.subscribe((selectedValue) => {
        this.mandatoryFormController = [];
        this.setupDynamicValidators(form, values, selectedValue);
      });
    });
  }
}
