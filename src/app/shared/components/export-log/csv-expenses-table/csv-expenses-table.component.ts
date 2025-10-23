import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { WindowService } from 'src/app/core/services/common/window.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { SkipExportList } from 'src/app/core/models/intacct/db/expense-group.model';

@Component({
  selector: 'app-csv-expenses-table',
  standalone: true,
  imports: [SharedModule, CommonModule, TableModule],
  templateUrl: './csv-expenses-table.component.html',
  styleUrl: './csv-expenses-table.component.scss'
})
export class CsvExpensesTableComponent {

  @Input({ required: true }) expenses: SkipExportList[];

  constructor(
    private windowService: WindowService
  ) { }

  openUrl(url: string) {
    this.windowService.openInNewTab(url);
  }

}
