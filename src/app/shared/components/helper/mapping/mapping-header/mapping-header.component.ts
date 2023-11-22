import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MappingStats } from 'src/app/core/models/db/mapping.model';

@Component({
  selector: 'app-mapping-header',
  templateUrl: './mapping-header.component.html',
  styleUrls: ['./mapping-header.component.scss']
})
export class MappingHeaderComponent implements OnInit {

  @Input() sourceField: string;

  @Input() mappingStats: MappingStats;

  @Input() showAutoMapEmployee: boolean;

  @Output() triggerAutoMapEmployee = new EventEmitter<boolean>();

  constructor() { }

  triggerAutoMapEmployees() {
    this.triggerAutoMapEmployee.emit(true);
  }

  ngOnInit(): void {
  }

}
