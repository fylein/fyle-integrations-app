import { Component, Input, OnInit } from '@angular/core';
import { AccountingGroupedErrorStat, AccountingGroupedErrors } from 'src/app/core/models/db/accounting-errors.model';
import { AppName } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-dashboard-error-section',
  templateUrl: './dashboard-error-section.component.html',
  styleUrls: ['./dashboard-error-section.component.scss']
})
export class DashboardErrorSectionComponent implements OnInit {

  @Input() isLoading: boolean;

  @Input() appName: AppName;

  @Input() errors: AccountingGroupedErrors;

  @Input() groupedErrorStat: AccountingGroupedErrorStat;

  constructor() { }

  ngOnInit(): void {
  }

}
