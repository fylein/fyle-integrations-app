import { Component, Input, OnInit } from '@angular/core';
import { ExpenseGroupList } from 'src/app/core/models/si/db/expense-group.model';
import { Expense } from 'src/app/core/models/si/db/expense.model';

@Component({
  selector: 'app-export-log-table',
  templateUrl: './export-log-table.component.html',
  styleUrls: ['./export-log-table.component.scss']
})
export class ExportLogTableComponent implements OnInit {

  @Input() filteredExpenseGroups: ExpenseGroupList [];

  clickedExportLogIndex: number = 0;

  expenses: Expense [] = [];

  visible: boolean = false;

  constructor() { }

  displayChildTable(index: number) {
    this.clickedExportLogIndex = index;
    this.expenses = this.filteredExpenseGroups[this.clickedExportLogIndex].expenses;
    this.visible = true;
  }

  openUrl(event: Event, url: string) {
    window.open(url, '_blank');
    event.stopPropagation();
  }

  ngOnInit(): void {
  }

}
