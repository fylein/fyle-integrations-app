import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shimmers',
  templateUrl: './shimmers.component.html',
  styleUrls: ['./shimmers.component.scss']
})
export class ShimmersComponent implements OnInit {

  @Input() exportLogHeader: string;

  @Input() isExportLogFetchInProgress: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
