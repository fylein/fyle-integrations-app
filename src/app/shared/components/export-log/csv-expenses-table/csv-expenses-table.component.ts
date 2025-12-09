import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { WindowService } from 'src/app/core/services/common/window.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExpenseDetails } from 'src/app/core/models/db/expense-details.model';

@Component({
  selector: 'app-csv-expenses-table',
  imports: [SharedModule, CommonModule, TableModule],
  templateUrl: './csv-expenses-table.component.html',
  styleUrl: './csv-expenses-table.component.scss',
})
export class CsvExpensesTableComponent {
  @Input({ required: true }) expenses: ExpenseDetails[];

  @Input() isSkippedExpenses: boolean = false;

  constructor(private windowService: WindowService) {}

  openUrl(url: string) {
    this.windowService.openInNewTab(url);
  }
}
