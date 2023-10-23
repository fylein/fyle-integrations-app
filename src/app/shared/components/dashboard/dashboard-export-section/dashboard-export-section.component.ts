import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-export-section',
  templateUrl: './dashboard-export-section.component.html',
  styleUrls: ['./dashboard-export-section.component.scss']
})
export class DashboardExportSectionComponent implements OnInit {

  @Input() isImportInProgress: any;

  @Input() exportInProgress: any;

  @Input() exportableExpenseGroupIds: any;

  @Input() failedExpenseGroupCount: any;

  @Input() exportProgressPercentage: any;

  @Input() lastExport: any;

  @Input() processedCount: any;

  constructor() { }

  export() {
    // For Export
    // Emit output
  }

  ngOnInit(): void {
  }

}
