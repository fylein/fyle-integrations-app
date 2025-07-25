import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig } from 'src/app/branding/branding-config';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { AccountingDisplayName, AccountingField, AppName, FyleField, QBOCorporateCreditCardExpensesObject, QboExportSettingDestinationOptionKey, QBOReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { QBOWorkspaceGeneralSetting } from 'src/app/core/models/qbo/db/workspace-general-setting.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboImportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-import-settings.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbo-base-mapping',
  templateUrl: './qbo-base-mapping.component.html',
  styleUrls: ['./qbo-base-mapping.component.scss']
})
export class QboBaseMappingComponent implements OnInit {

  isLoading: boolean = true;

  destinationOptions: DestinationAttribute[];

  employeeFieldMapping: FyleField;

  sourceField: string;

  destinationField: string;

  showAutoMapEmployee: boolean;

  reimbursableExpenseObject: QBOReimbursableExpensesObject | null;

  cccExpenseObject: QBOCorporateCreditCardExpensesObject | null;

  AppName = AppName;

  FyleField = FyleField;

  displayName: string | undefined = undefined;

  isMultiLineOption: boolean;

  brandingConfig = brandingConfig;

  destinationAttributes: string | string[];

  constructor(
    private route: ActivatedRoute,
    private mappingService: MappingService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private importSettingsService: QboImportSettingsService,
    private translocoService: TranslocoService
  ) { }

  triggerAutoMapEmployees(): void {
    this.isLoading = true;
    this.mappingService.triggerAutoMapEmployees().subscribe(() => {
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.INFO, this.translocoService.translate('qboBaseMapping.autoMappingInProgress'));
    }, () => {
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qboBaseMapping.autoMappingError'));
    });
  }

  private getDestinationField(workspaceGeneralSetting: QBOWorkspaceGeneralSetting, mappingSettings: MappingSetting[]): string {
    if (this.sourceField === FyleField.EMPLOYEE) {
      return workspaceGeneralSetting.employee_field_mapping;
    } else if (this.sourceField === FyleField.CATEGORY) {
      return AccountingField.ACCOUNT;
    }

    return mappingSettings.find((setting) => setting.source_field === this.sourceField)?.destination_field || '';
  }

  private setupPage(): void {
    this.sourceField = decodeURIComponent(this.route.snapshot.params.source_field.toUpperCase());
    forkJoin([
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.mappingService.getMappingSettings(),
      this.importSettingsService.getImportSettings()
    ]).subscribe((responses) => {
      this.reimbursableExpenseObject = responses[0].reimbursable_expenses_object;
      this.cccExpenseObject = responses[0].corporate_credit_card_expenses_object;
      this.employeeFieldMapping = (responses[0].employee_field_mapping as unknown as FyleField);
      this.showAutoMapEmployee = responses[0].auto_map_employees ? true : false;
      this.destinationField = this.getDestinationField(responses[0], responses[1].results);

      if (this.destinationField === QboExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT && this.cccExpenseObject === QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE) {
        this.destinationAttributes = [QboExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT, QboExportSettingDestinationOptionKey.BANK_ACCOUNT];
      } else {
        this.destinationAttributes = this.destinationField;
      }

      this.isMultiLineOption = responses[2].workspace_general_settings.import_code_fields?.includes(this.destinationField);

      if (this.destinationField === AccountingField.ACCOUNT) {
        this.displayName = responses[0].import_items ? `${AccountingDisplayName.ITEM},${AccountingDisplayName.ACCOUNT}` : AccountingDisplayName.ACCOUNT;
      } else {
        this.displayName = undefined;
      }

      this.mappingService.getPaginatedDestinationAttributes(this.destinationAttributes, undefined, this.displayName).subscribe((responses) => {
        this.destinationOptions = responses.results;
        this.isLoading = false;
      });
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.isLoading = true;
      this.setupPage();
    });
  }

}
