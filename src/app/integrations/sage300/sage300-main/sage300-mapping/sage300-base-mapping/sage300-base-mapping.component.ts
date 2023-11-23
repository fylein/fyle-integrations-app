import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FyleField, IntegrationName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';

@Component({
  selector: 'app-sage300-base-mapping',
  templateUrl: './sage300-base-mapping.component.html',
  styleUrls: ['./sage300-base-mapping.component.scss']
})
export class Sage300BaseMappingComponent implements OnInit {

  sourceField: string;

  destinationField: string;

  isLoading: boolean = true;

  showAutoMapEmployee: boolean = false;

  reimbursableExpenseObject: string;

  cccExpenseObject: string;

  employeeFieldMapping: FyleField = FyleField.VENDOR;

  destinationOptions: DestinationAttribute[];

  constructor(
    private route: ActivatedRoute,
    private mappingService: MappingService,
    private toastService: IntegrationsToastService
  ) { }

  triggerAutoMapEmployees() {
    this.isLoading = true;
    this.mappingService.triggerAutoMapEmployees().subscribe(() => {
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Auto mapping of employees may take few minutes');
    }, () => {
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong, please try again');
    });
  }

  getSourceType() {
    if (this.sourceField==='EMPLOYEE') {
      return 'VENDOR';
    }

    if (this.sourceField==='CATEGORY') {
      return 'ACCOUNT';
    }

    return '';
  }

  setupPage(): void {
    this.sourceField = this.route.snapshot.params.source_field;
    this.mappingService.getExportSettings().subscribe((response) => {
      this.reimbursableExpenseObject = response.reimbursable_expenses_object;
      this.cccExpenseObject = response.corporate_credit_card_expenses_object;

      this.showAutoMapEmployee = response.auto_map_employees ? true : false;

      this.destinationField = this.getSourceType();


      this.mappingService.getGroupedDestinationAttributes([this.destinationField], IntegrationName.SAGE300).subscribe((response: any) => {
        if (this.sourceField==='EMPLOYEE') {
          this.destinationOptions = this.destinationField ? response.EMPLOYEE : response.VENDOR;
        }
        if (this.sourceField==='CATEGORY') {
          if (this.destinationField === 'EXPENSE_TYPE') {
            this.destinationOptions = response.EXPENSE_TYPE;
          } else {
            this.destinationOptions = response.ACCOUNT;
          }
        }

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