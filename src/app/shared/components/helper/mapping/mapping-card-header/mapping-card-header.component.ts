import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig, brandingContent, brandingStyle } from 'src/app/branding/branding-config';
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

  readonly brandingStyle = brandingStyle;

  constructor() { }

  getSourceField(destinationField: string): string {
    destinationField = new SnakeCaseToSpaceCasePipe().transform(destinationField).toLowerCase();
    const lastChar = destinationField.slice(-1).toLowerCase();
    const lastTwoChars = destinationField.slice(-2).toLowerCase();
    const pattern = new RegExp('[^a-zA-Z\d\s:]');

    if (lastChar === 'y') {
        return destinationField.slice(0, -1) + 'ies';
    } else if (['s', 'x', 'z'].includes(lastChar) || ['sh', 'ch'].includes(lastTwoChars)) {
        return destinationField + 'es';
    } else if (pattern.test(lastChar)) {
      return destinationField;
    }
    return destinationField + 's';
  }

  triggerAutoMapEmployees() {
    this.triggerAutoMapEmployee.emit(true);
  }

  ngOnInit(): void {
  }

}
