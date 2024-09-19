import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import type { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import type { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { AccountingDisplayName, AccountingField, AppName, FyleField, NetSuiteCorporateCreditCardExpensesObject, NetsuiteCategoryDestination, NetsuiteReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import type { NetsuiteExportSettingWorkspaceGeneralSettingPost } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-export-setting.model';
import type { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import type { MappingService } from 'src/app/core/services/common/mapping.service';
import type { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-netsuite-base-mapping',
  templateUrl: './netsuite-base-mapping.component.html',
  styleUrls: ['./netsuite-base-mapping.component.scss']
})
export class NetsuiteBaseMappingComponent implements OnInit {

  isLoading: boolean = true;

  destinationOptions: DestinationAttribute[];

  employeeFieldMapping: FyleField;

  sourceField: string;

  destinationField: string;

  showAutoMapEmployee: boolean;

  reimbursableExpenseObject: NetsuiteReimbursableExpensesObject | null;

  cccExpenseObject: NetSuiteCorporateCreditCardExpensesObject | null;

  AppName = AppName;

  FyleField = FyleField;

  displayName: string | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private mappingService: MappingService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService
  ) { }

  triggerAutoMapEmployees(): void {
    this.isLoading = true;
    this.mappingService.triggerAutoMapEmployees().subscribe(() => {
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.INFO, 'Auto mapping of employees may take few minutes');
    }, () => {
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong, please try again');
    });
  }

  private getDestinationField(workspaceGeneralSetting: NetsuiteExportSettingWorkspaceGeneralSettingPost, mappingSettings: MappingSetting[]): string {
    if (this.sourceField === FyleField.EMPLOYEE) {
      return workspaceGeneralSetting.employee_field_mapping;
    } else if (this.sourceField === FyleField.CATEGORY) {
      return (workspaceGeneralSetting.reimbursable_expenses_object === NetsuiteReimbursableExpensesObject.EXPENSE_REPORT || workspaceGeneralSetting.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT) ? NetsuiteCategoryDestination.EXPENSE_CATEGORY : NetsuiteCategoryDestination.ACCOUNT;
    }

    return mappingSettings.find((setting) => setting.source_field === this.sourceField)?.destination_field || '';
  }

  private setupPage(): void {
    this.sourceField = decodeURIComponent(this.route.snapshot.params.source_field.toUpperCase());
    forkJoin([
      this.workspaceService.getConfiguration(),
      this.mappingService.getMappingSettings()
    ]).subscribe((responses) => {
      this.reimbursableExpenseObject = responses[0].reimbursable_expenses_object;
      this.cccExpenseObject = responses[0].corporate_credit_card_expenses_object;
      this.employeeFieldMapping = (responses[0].employee_field_mapping as unknown as FyleField);
      this.showAutoMapEmployee = responses[0].auto_map_employees ? true : false;

      this.destinationField = this.getDestinationField(responses[0], responses[1].results);

      if (this.destinationField === AccountingField.ACCOUNT) {
        this.displayName = responses[0].import_items ? `${AccountingDisplayName.ITEM},${AccountingDisplayName.ACCOUNT}` : AccountingDisplayName.ACCOUNT;
      } else {
        this.displayName = undefined;
      }

      this.mappingService.getPaginatedDestinationAttributes(this.destinationField, undefined, this.displayName).subscribe((responses) => {
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
