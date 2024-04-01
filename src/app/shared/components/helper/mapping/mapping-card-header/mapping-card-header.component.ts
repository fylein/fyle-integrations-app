import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig, brandingContent } from 'src/app/branding/branding-config';
import { MappingStats } from 'src/app/core/models/db/mapping.model';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

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

  getSourceField(sourceField: string): string {
    const fieldName = new SnakeCaseToSpaceCasePipe().transform(sourceField).toLowerCase()
    if(fieldName[fieldName.length-1] === 'y') {
      return fieldName.slice(0,fieldName.length-1)+'ies'
    } else {
      return fieldName+'s'
    }
  }

  triggerAutoMapEmployees() {
    this.triggerAutoMapEmployee.emit(true);
  }

  ngOnInit(): void {
  }

}
