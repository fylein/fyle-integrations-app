import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import type { QBDMappingStats } from 'src/app/core/models/qbd/db/qbd-mapping.model';

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
