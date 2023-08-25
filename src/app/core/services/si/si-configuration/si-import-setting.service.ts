import { EventEmitter, Injectable, Output } from '@angular/core';
import { SiApiService } from '../si-core/si-api.service';
import { SiWorkspaceService } from '../si-core/si-workspace.service';
import { Observable } from 'rxjs';
import { ImportSettingGet, ImportSettingPost, MappingSetting } from 'src/app/core/models/si/si-configuration/import-settings.model';
import { ExpenseFieldCreationDialogComponent } from 'src/app/shared/components/si/configuration/configuration-import-settings/expense-field-creation-dialog/expense-field-creation-dialog.component';
import { ExpenseField, ExpenseFieldFormArray } from 'src/app/core/models/si/misc/expense-field.model';


@Injectable({
  providedIn: 'root'
})
export class SiImportSettingService {

  @Output() patchExpenseFieldEmitter: EventEmitter<ExpenseFieldFormArray> = new EventEmitter();

  constructor(
    private apiService: SiApiService,
    private workspaceService: SiWorkspaceService
  ) { }

  getImportSettings(): Observable<ImportSettingGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  postImportSettings(importSettingsPayload: ImportSettingPost): Observable<ImportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, importSettingsPayload);
  }

  private getPatchExpenseFieldValues(destinationType: string, sourceField: string = '', source_placeholder: string = ''): ExpenseFieldFormArray {
    return {
        source_field: sourceField,
        destination_field: destinationType,
        import_to_fyle: sourceField ? true : false,
        is_custom: sourceField ? true : false,
        source_placeholder: source_placeholder
    };
  }

  createExpenseField(destinationType: string, mappingSettings: MappingSetting[]): void {
    const existingFields = mappingSettings.map(setting => setting.source_field.split('_').join(' '));
    // const dialogRef = this.dialogService.open(ExpenseFieldCreationDialogComponent, {
    //   width: '551px',
    //   data: existingFields
    // });

    const expenseFieldValue = this.getPatchExpenseFieldValues(destinationType);
    this.patchExpenseFieldEmitter.emit(expenseFieldValue);

    // dialogRef.onClose.subscribe((expenseField: MappingSetting) => {
    //   if (expenseField) {
    //     const sourceType = expenseField.source_field.split(' ').join('_').toUpperCase();

    //     const expenseFieldValue = this.getPatchExpenseFieldValues(destinationType, sourceType, '');
    //     this.patchExpenseFieldEmitter.emit(expenseFieldValue);
    //   }
    // });
  }
}
