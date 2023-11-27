import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountingExportList } from 'src/app/core/models/db/accounting-export.model';

@Component({
  selector: 'app-sage300-completed-export-log',
  templateUrl: './sage300-completed-export-log.component.html',
  styleUrls: ['./sage300-completed-export-log.component.scss']
})
export class Sage300CompletedExportLogComponent implements OnInit {

  isLoading: boolean;

  exportLogForm: FormGroup;

  totalCount: number;

  filteredExpenseGroups: AccountingExportList[];

  expenseGroups: AccountingExportList[];

  constructor() { }

  public filterTableChange(event: any) {
    const query = event.target.value.toLowerCase();

    this.filteredExpenseGroups = this.expenseGroups.filter((group: AccountingExportList) => {
      const employeeName = group.employee ? group.employee[0] : '';
      const employeeID = group.employee ? group.employee[1] : '';
      const expenseType = group.expenseType ? group.expenseType : '';
      const referenceNumber = group.referenceNumber ? group.referenceNumber : '';

      return (
        employeeName.toLowerCase().includes(query) ||
        employeeID.toLowerCase().includes(query) ||
        expenseType.toLowerCase().includes(query) ||
        referenceNumber.toLowerCase().includes(query)
      );
    });
  }

  ngOnInit(): void {
  }

}
