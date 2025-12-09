import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig, brandingStyle } from 'src/app/branding/branding-config';
import { MappingStats } from 'src/app/core/models/db/mapping.model';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
  selector: 'app-card-mapping-header',
  templateUrl: './mapping-card-header.component.html',
  styleUrls: ['./mapping-card-header.component.scss'],
  standalone: false,
})
export class MappingCardHeaderComponent implements OnInit {
  @Input() sourceField: string;

  @Input() mappingStats: MappingStats;

  @Input() showAutoMapEmployee: boolean;

  @Output() triggerAutoMapEmployee = new EventEmitter<boolean>();

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor() {}

  getPluralOfSourceField(sourceField: string): string {
    sourceField = new SnakeCaseToSpaceCasePipe().transform(sourceField).toLowerCase();
    const lastChar = sourceField.slice(-1).toLowerCase();
    const lastTwoChars = sourceField.slice(-2).toLowerCase();
    const pattern = new RegExp('[^a-zA-Z0-9 :]');

    if (lastChar === 'y') {
      return sourceField.slice(0, -1) + 'ies';
    } else if (['s', 'x', 'z'].includes(lastChar) || ['sh', 'ch'].includes(lastTwoChars)) {
      return sourceField + 'es';
    } else if (pattern.test(lastChar)) {
      return sourceField;
    }
    return sourceField + 's';
  }

  getSingularOfSourceField(sourceField: string): string {
    return new SnakeCaseToSpaceCasePipe().transform(sourceField).toLowerCase();
  }

  triggerAutoMapEmployees() {
    this.triggerAutoMapEmployee.emit(true);
  }

  ngOnInit(): void {}
}
