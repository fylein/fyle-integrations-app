import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountingExportClass, AccountingExportList, SkippedAccountingExportClass } from 'src/app/core/models/db/accounting-export.model';
import { SkipExportList } from 'src/app/core/models/si/db/expense-group.model';

@Component({
  selector: 'app-sage300-skipped-export-log',
  templateUrl: './sage300-skipped-export-log.component.html',
  styleUrls: ['./sage300-skipped-export-log.component.scss']
})
export class Sage300SkippedExportLogComponent implements OnInit {

  isLoading: boolean;

  totalCount: number;

  skipExportLogForm: FormGroup;

  accountingExports: SkipExportList[];

  filteredAccountingExports: SkipExportList[];

  limit: number;

  offset: number = 0;

  currentPage: number = 1;

  constructor() { }

  public handleSimpleSearch(event: any) {
    const query = event.target.value.toLowerCase();

    this.filteredAccountingExports = this.accountingExports.filter((group: SkipExportList) => {
      return SkippedAccountingExportClass.getfilteredSkippedAccountingExports(query, group);
    });
  }

  ngOnInit(): void {
  }

}
