import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountingExportClass, AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { SkipExportList } from 'src/app/core/models/si/db/expense-group.model';

@Component({
  selector: 'app-sage300-skipped-export-log',
  templateUrl: './sage300-skipped-export-log.component.html',
  styleUrls: ['./sage300-skipped-export-log.component.scss']
})
export class Sage300SkippedExportLogComponent implements OnInit {

  isLoading: boolean;

  totalCount: number;

  exportLogForm: FormGroup;

  accountingExports: SkipExportList[];

  filteredAccountingExports: SkipExportList[];

  constructor() { }

  ngOnInit(): void {
  }

}
