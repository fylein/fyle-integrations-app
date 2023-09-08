import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Mapping, MappingModel, MappingPost } from 'src/app/core/models/qbd/db/mapping.model';

@Component({
  selector: 'app-mapping-table',
  templateUrl: './mapping-table.component.html',
  styleUrls: ['./mapping-table.component.scss']
})
export class MappingTableComponent implements OnInit {

  @Input() mappings!: Mapping[];

  @Output() postMapping = new EventEmitter<MappingPost>();

  isSelectedRow: number;

  destinationValue: string;

  constructor() { }

  onTextBoxChange(event: any, index: number) {
    const tragetValue: string = event.target.value
    this.destinationValue = tragetValue
  }

  onBlurEvent() {
    this.isSelectedRow = 0
  }

  isTypingInBox(event: any, row: Mapping) {
    if(event.keyCode === 13) {
      this.isSelectedRow = 0
      this.saveRow(row)
    }
    this.isSelectedRow = row.id
  }

  saveRow(data: Mapping) {
    data.destination_value = this.destinationValue
    const mappingPayload = MappingModel.constructPayload(data)
    this.postMapping.emit(mappingPayload)
    this.isSelectedRow = 0
  }

  ngOnInit(): void {
  }

}
