import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FyleField } from 'src/app/core/models/enum/enum.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';

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

  employeeFieldMapping: FyleField;

  destinationOptions: DestinationAttribute[];

  constructor(
    private route: ActivatedRoute,
    private mappingService: MappingService
  ) { }


  private isExpenseTypeRequired(): boolean {
    return this.reimbursableExpenseObject === "EXPENSE_REPORT" || this.cccExpenseObject === "EXPENSE_REPORT";
  }

  getSourceType() {
    if (this.sourceField==='EMPLOYEE') {
      return this.employeeFieldMapping;
    }

    if (this.sourceField==='CATEGORY') {
      if (this.isExpenseTypeRequired()) {
        return 'EXPENSE_TYPE';
      }
        return 'ACCOUNT';

    }

    return '';
  }

  setupPage(): void {
    this.sourceField = this.route.snapshot.params.source_field;
    this.mappingService.getExportSettings().subscribe((response) => {
      this.reimbursableExpenseObject = response.reimbursable_expenses_object;
      this.cccExpenseObject = response.corporate_credit_card_expenses_object;

      this.employeeFieldMapping = response.employee_field_mapping;
      this.showAutoMapEmployee = response.auto_map_employees ? true : false;

      this.destinationField = this.getSourceType();


      this.mappingService.getGroupedDestinationAttributes([this.destinationField], 'SAGE300').subscribe((response: any) => {
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
      });
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}