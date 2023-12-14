import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkspaceService } from '../../common/workspace.service';
import { ApiService } from '../../common/api.service';
import { QBOExportSettingGet, QBOExportSettingModel, QBOExportSettingPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { ExportModuleRule } from 'src/app/core/models/common/export-settings.model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class QboExportSettingsService {

  private mandatoryFormController: string[] = [];

  @Output() creditCardExportTypeChange: EventEmitter<string> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getExportSettings(): Observable<QBOExportSettingGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postExportSettings(exportSettingsPayload: QBOExportSettingPost): Observable<QBOExportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }

  setupDynamicValidators(form: FormGroup, values: ExportModuleRule, selectedValue: string): void {
    Object.entries(values.requiredValue).forEach(([key, value]) => {
      if (key === selectedValue) {
        value.forEach((formController: string) => {
          if (values.formController === 'creditCardExportType') {
            this.creditCardExportTypeChange.emit(selectedValue);
          }

          const isFieldMandatory = QBOExportSettingModel.getMandatoryField(form, formController);
          if (isFieldMandatory) {
            this.mandatoryFormController.push(formController);
            QBOExportSettingModel.markControllerAsRequired(form, formController);
          } else {
            QBOExportSettingModel.clearValidatorAndResetValue(form, formController);
          }
        });
      } else {
        value.forEach((formController: string) => {
          if (this.mandatoryFormController.length && !this.mandatoryFormController.includes(formController)) {
            QBOExportSettingModel.clearValidatorAndResetValue(form, formController);
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
