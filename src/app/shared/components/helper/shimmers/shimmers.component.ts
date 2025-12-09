import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shimmers',
  templateUrl: './shimmers.component.html',
  styleUrls: ['./shimmers.component.scss'],
  standalone: false,
})
export class ShimmersComponent implements OnInit {
  @Input() exportLogHeader: string;

  @Input() isExportLogFetchInProgress: boolean;

  @Input() isDashboardImportInProgress: boolean;

  @Input() isMappingTableShimmers: boolean;

  constructor() {}

  ngOnInit(): void {}
}
