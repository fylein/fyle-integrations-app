import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { AppName, FyleReferenceType } from 'src/app/core/models/enum/enum.model';
import { SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';

@Component({
  selector: 'app-sage300-completed-export-log',
  templateUrl: './sage300-completed-export-log.component.html',
  styleUrls: ['./sage300-completed-export-log.component.scss']
})
export class Sage300CompletedExportLogComponent implements OnInit {

  isLoading: boolean;

  appName: AppName = AppName.SAGE300;

  exportLogForm: FormGroup;

  totalCount: number;

  limit: number;

  offset: number = 0;

  currentPage: number = 1;

  filteredExpenseGroups: AccountingExportList[];

  expenseGroups: AccountingExportList[];

  selectedDateFilter: SelectedDateFilter | null;

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

  getExpenseGroups(limit: number, offset:number) {
    this.isLoading = true;
    const expenseGroups: ExpenseGroupList[] = [];

    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    }

    return this.exportLogService.getExpenseGroups(TaskLogState.COMPLETE, limit, offset, this.selectedDateFilter).subscribe(expenseGroupResponse => {
      if (!this.isDateSelected) {
        this.totalCount = expenseGroupResponse.count;
      }
      expenseGroupResponse.results.forEach((expenseGroup: ExpenseGroup, index: number = 0) => {
        const referenceType: FyleReferenceType = this.exportLogService.getReferenceType(expenseGroup.description);
        let referenceNumber: string = expenseGroup.description[referenceType];

        if (referenceType === FyleReferenceType.EXPENSE) {
          referenceNumber = expenseGroup.expenses[0].expense_number;
        } else if (referenceType === FyleReferenceType.PAYMENT) {
          referenceNumber = expenseGroup.expenses[0].payment_number;
        }

        expenseGroups.push({
          index: index++,
          exportedAt: expenseGroup.exported_at,
          employee: [expenseGroup.employee_name, expenseGroup.description.employee_email],
          expenseType: expenseGroup.fund_source === 'CCC' ? 'Corporate Card' : 'Reimbursable',
          fyleReferenceType: null,
          referenceNumber: referenceNumber,
          exportedAs: expenseGroup.export_type,
          fyleUrl: this.exportLogService.generateFyleUrl(expenseGroup, referenceType),
          intacctUrl: `https://www-p02.intacct.com/ia/acct/ur.phtml?.r=${expenseGroup.response_logs?.url_id}`,
          expenses: expenseGroup.expenses
        });
      });
      this.filteredExpenseGroups = expenseGroups;
      this.expenseGroups = [...this.filteredExpenseGroups];
      this.isLoading = false;
    });
  }

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
    this.limit = limit;
    this.currentPage = 1;
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.getExpenseGroups(limit, this.offset);
  }

  pageChanges(offset: number): void {
    this.isLoading = true;
    this.offset = offset;
    this.currentPage = Math.ceil(offset / this.limit) + 1;
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.getExpenseGroups(this.limit, offset);
  }

  ngOnInit(): void {
  }

}
