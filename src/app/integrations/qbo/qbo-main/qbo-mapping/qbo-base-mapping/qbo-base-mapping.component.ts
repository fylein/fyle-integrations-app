import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AccountingField, EmployeeFieldMapping, FyleField, QBOCorporateCreditCardExpensesObject, QBOReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { QBOWorkspaceGeneralSetting } from 'src/app/core/models/qbo/db/workspace-general-setting.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

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

  constructor(
    private route: ActivatedRoute,
    private mappingService: MappingService,
    private workspaceService: WorkspaceService
  ) { }

  triggerAutoMapEmployees(): void {
    // TODO
  }

  private getDestinationField(workspaceGeneralSetting: QBOWorkspaceGeneralSetting): string {
    if (this.sourceField === FyleField.EMPLOYEE) {
      return workspaceGeneralSetting.employee_field_mapping;
    }

    if (this.sourceField === FyleField.CATEGORY) {
      return AccountingField.ACCOUNT;
    }

    return '';
  }

  private setupPage(): void {
    this.sourceField = this.route.snapshot.params.source_field;
    this.workspaceService.getWorkspaceGeneralSettings().subscribe((response: QBOWorkspaceGeneralSetting) => {
      this.reimbursableExpenseObject = response.reimbursable_expenses_object;
      this.cccExpenseObject = response.corporate_credit_card_expenses_object;
      this.showAutoMapEmployee = response.auto_map_employees ? true : false;

      this.destinationField = this.getDestinationField(response);

      this.mappingService.getDestinationAttributes(this.destinationField, 'v1', 'qbo', undefined, true).subscribe((response: any) => {
        this.destinationOptions = response;
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
