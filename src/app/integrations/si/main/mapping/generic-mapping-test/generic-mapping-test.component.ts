import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { CorporateCreditCardExpensesObject, FyleField, IntacctReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';


@Component({
  selector: 'app-generic-mapping-test',
  templateUrl: './generic-mapping-test.component.html',
  styleUrls: ['./generic-mapping-test.component.scss']
})
export class GenericMappingTestComponent implements OnInit {

  sourceField: string;

  destinationField: string;

  isLoading: boolean = true;

  showAutoMapEmployee: boolean = false;

  reimbursableExpenseObject: IntacctReimbursableExpensesObject | undefined;

  cccExpenseObject: CorporateCreditCardExpensesObject | undefined;

  employeeFieldMapping: FyleField;

  destinationOptions: DestinationAttribute[];

  constructor(
    private route: ActivatedRoute,
    private mappingService: SiMappingsService
  ) { }


  private isExpenseTypeRequired(): boolean {
    return this.reimbursableExpenseObject === IntacctReimbursableExpensesObject.EXPENSE_REPORT || this.cccExpenseObject === CorporateCreditCardExpensesObject.EXPENSE_REPORT;
  }

  getAttributesFilteredByConfig() {

    if(this.sourceField==='EMPLOYEE') {
      if (this.employeeFieldMapping === 'VENDOR') {
        return 'VENDOR';
      } else if (this.employeeFieldMapping === 'EMPLOYEE') {
        return 'EMPLOYEE';
      }
    }

    if(this.sourceField==='CATEGORY') {
      if (this.isExpenseTypeRequired()) {
        return 'EXPENSE_TYPE';
      } else {
        return 'ACCOUNT';
      }
    }

    return ''

  }

  ngOnInit(): void {
    this.sourceField = this.route.snapshot.params.source_field;
    this.mappingService.getConfiguration().subscribe((response) => {
      this.reimbursableExpenseObject = response.reimbursable_expenses_object;
      this.cccExpenseObject = response.corporate_credit_card_expenses_object;

      this.employeeFieldMapping = response.employee_field_mapping;
      this.showAutoMapEmployee = response.auto_map_employees ? true : false;
      
      this.destinationField = this.getAttributesFilteredByConfig();


      this.mappingService.getGroupedDestinationAttributes([this.destinationField]).subscribe((response) => {
        if(this.sourceField==='EMPLOYEE') {
          this.destinationOptions = this.destinationField ? response.EMPLOYEE : response.VENDOR;
        }
        if(this.sourceField==='CATEGORY') {
          if (this.destinationField === 'EXPENSE_TYPE') {
            this.destinationOptions = response.EXPENSE_TYPE;
          } else {
            this.destinationOptions = response.ACCOUNT;
          }
        }
      });
    });
  }

}
