import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig, brandingContent } from 'src/app/branding/branding-config';
import { MappingStats } from 'src/app/core/models/db/mapping.model';

@Component({
  selector: 'app-card-mapping-header',
  templateUrl: './mapping-card-header.component.html',
  styleUrls: ['./mapping-card-header.component.scss']
})
export class MappingCardHeaderComponent implements OnInit {

  @Input() sourceField: string;

  @Input() mappingStats: MappingStats;

  @Input() showAutoMapEmployee: boolean;

  @Output() triggerAutoMapEmployee = new EventEmitter<boolean>();

  readonly brandingConfig = brandingConfig;

  readonly brandingContent = brandingContent;

  constructor() { }

  triggerAutoMapEmployees() {
    this.triggerAutoMapEmployee.emit(true);
  }

  ngOnInit(): void {
  }

}
