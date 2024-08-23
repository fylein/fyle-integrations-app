import { Component, Input, OnInit } from '@angular/core';
import { QBDMappingStats } from 'src/app/core/models/qbd/db/qbd-mapping.model';

@Component({
  selector: 'app-qbd-mapping-header-section',
  templateUrl: './qbd-mapping-header-section.component.html',
  styleUrls: ['./qbd-mapping-header-section.component.scss']
})
export class QbdMappingHeaderSectionComponent implements OnInit {

  @Input() sourceType: string;

  @Input() mappingStats: QBDMappingStats;

  constructor() { }

  ngOnInit(): void {

  }

}
