import { Component, Input, OnInit } from '@angular/core';
import { MappingStats } from 'src/app/core/models/qbd/db/qbd-mapping.model';

@Component({
  selector: 'app-mapping-header-section',
  templateUrl: './mapping-header-section.component.html',
  styleUrls: ['./mapping-header-section.component.scss']
})
export class MappingHeaderSectionComponent implements OnInit {

  @Input() sourceType: string;

  @Input() mappingStats: MappingStats;

  constructor() { }

  ngOnInit(): void {

  }

}
