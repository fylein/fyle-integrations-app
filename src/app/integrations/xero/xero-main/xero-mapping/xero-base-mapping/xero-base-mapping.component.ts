import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import type { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import type { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import type { XeroCorporateCreditCardExpensesObject, XeroReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { AccountingField, AppName, FyleField, MappingDestinationField, MappingSourceField, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import type { XeroWorkspaceGeneralSetting } from 'src/app/core/models/xero/db/xero-workspace-general-setting.model';
import type { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import type { MappingService } from 'src/app/core/services/common/mapping.service';
import type { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-xero-base-mapping',
  templateUrl: './xero-base-mapping.component.html',
  styleUrls: ['./xero-base-mapping.component.scss']
})
export class XeroBaseMappingComponent implements OnInit {
  isLoading: boolean = true;

  destinationOptions: DestinationAttribute[];

  employeeFieldMapping: FyleField;

  sourceField: string;

  destinationField: string;

  showAutoMapEmployee: boolean;

  reimbursableExpenseObject: XeroReimbursableExpensesObject | null;

  cccExpenseObject: XeroCorporateCreditCardExpensesObject | null;

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

  private getDestinationField(workspaceGeneralSetting: XeroWorkspaceGeneralSetting, mappingSettings: MappingSetting[]): string {
    if (this.sourceField === FyleField.EMPLOYEE) {
      return AccountingField.CONTACT;
    } else if (this.sourceField === FyleField.CATEGORY) {
      return AccountingField.ACCOUNT;
    } else if (this.sourceField === MappingSourceField.TAX_GROUP) {
      return MappingDestinationField.TAX_CODE;
    }

    return mappingSettings.find((setting) => setting.source_field === this.sourceField)?.destination_field || '';
  }

  private setupPage(): void {
    this.sourceField = decodeURIComponent(this.route.snapshot.params.source_field.toUpperCase());
    forkJoin([
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.mappingService.getMappingSettings()
    ]).subscribe((responses) => {
      this.reimbursableExpenseObject = responses[0].reimbursable_expenses_object;
      this.cccExpenseObject = responses[0].corporate_credit_card_expenses_object;
      this.employeeFieldMapping = (responses[0].employee_field_mapping as unknown as FyleField);
      this.showAutoMapEmployee = responses[0].auto_map_employees ? true : false;

      this.destinationField = this.getDestinationField(responses[0], responses[1].results);

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
