import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig } from 'src/app/branding/branding-config';
import { IntacctConfiguration } from 'src/app/core/models/db/configuration.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { AccountingDisplayName, AccountingField, AppName, FyleField, IntacctCategoryDestination, IntacctCorporateCreditCardExpensesObject, IntacctReimbursableExpensesObject, MappingSourceField, SageIntacctField, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { CommonResourcesService } from 'src/app/core/services/common/common-resources.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';

@Component({
  selector: 'app-intacct-base-mapping',
  templateUrl: './intacct-base-mapping.component.html',
  styleUrls: ['./intacct-base-mapping.component.scss']
})
export class IntacctBaseMappingComponent implements OnInit {

  isLoading: boolean = true;

  appName: AppName = AppName.INTACCT;

  FyleField = FyleField;

  destinationOptions: DestinationAttribute[];

  employeeFieldMapping: FyleField;

  sourceField: string;

  sourceFieldDisplayName?: string;

  destinationField: string;

  destinationFieldDisplayName?: string;

  showAutoMapEmployee: boolean;

  reimbursableExpenseObject: IntacctReimbursableExpensesObject | null;

  cccExpenseObject: IntacctCorporateCreditCardExpensesObject | null;

  acceptedCodeField: string[] = [SageIntacctField.ACCOUNT, SageIntacctField.DEPARTMENT, MappingSourceField.PROJECT];

  brandingConfig = brandingConfig;

  constructor(
    private route: ActivatedRoute,
    private mappingService: MappingService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private commonResourcesService: CommonResourcesService
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

  private getDestinationField(intacctConfiguration: IntacctConfiguration, mappingSettings: MappingSetting[]): string {
    if (this.sourceField === FyleField.EMPLOYEE) {
      return intacctConfiguration.employee_field_mapping;
    } else if (this.sourceField === FyleField.CATEGORY) {
      if (intacctConfiguration.reimbursable_expenses_object===IntacctReimbursableExpensesObject.EXPENSE_REPORT || intacctConfiguration.corporate_credit_card_expenses_object===IntacctCorporateCreditCardExpensesObject.EXPENSE_REPORT) {
        return IntacctCategoryDestination.EXPENSE_TYPE;
      }
        return IntacctCategoryDestination.ACCOUNT;

    }

    return mappingSettings.find((setting) => setting.source_field === this.sourceField)?.destination_field || '';
  }

  private setupPage(): void {
    this.sourceField = this.route.snapshot.params.source_field.toUpperCase();
    this.sourceFieldDisplayName = this.commonResourcesService.getCachedDisplayName({
      attributeType: this.sourceField,
      sourceType: 'FYLE'
    });

    forkJoin([
      this.workspaceService.getConfiguration(),
      this.mappingService.getMappingSettings()
    ]).subscribe((responses) => {
      this.reimbursableExpenseObject = responses[0].reimbursable_expenses_object;
      this.cccExpenseObject = responses[0].corporate_credit_card_expenses_object;
      this.employeeFieldMapping = (responses[0].employee_field_mapping as unknown as FyleField);
      this.showAutoMapEmployee = responses[0].auto_map_employees ? true : false;

      this.destinationField = this.getDestinationField(responses[0], responses[1].results);
      this.destinationFieldDisplayName = this.commonResourcesService.getCachedDisplayName({
        attributeType: this.destinationField,
        sourceType: 'ACCOUNTING'
      });

      this.mappingService.getPaginatedDestinationAttributes(this.destinationField, undefined).subscribe((response: any) => {
        this.destinationOptions = response.results;
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
