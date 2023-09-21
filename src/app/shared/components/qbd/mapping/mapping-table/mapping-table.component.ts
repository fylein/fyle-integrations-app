import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType, OperatingSystem } from 'src/app/core/models/enum/enum.model';
import { Mapping, MappingModel, MappingPost } from 'src/app/core/models/qbd/db/mapping.model';
import { EmployeeMapping } from 'src/app/core/models/si/db/employee-mapping.model';
import { MappingIntacct, MappingResponse, MappingStats } from 'src/app/core/models/si/db/mapping.model';

@Component({
  selector: 'app-mapping-table',
  templateUrl: './mapping-table.component.html',
  styleUrls: ['./mapping-table.component.scss']
})
export class MappingTableComponent implements OnInit {

  @Input() mappings!: Mapping[] | EmployeeMapping[];

  @Input() destinationFieldType: FieldType;

  @Input() fyleHeaderName: string;

  @Input() destinationHeaderName: string;

  @Input() operatingSystem: string;

  @Output() postMapping = new EventEmitter<MappingPost>();

  allOS = OperatingSystem;

  focussedMappingId: number;

  destinationValue: string;

  fieldType = FieldType;

  constructor() { }

  onTextBoxChange(event: any, index: number) {
    const targetValue: string = event.target.value;
    this.destinationValue = targetValue;
  }

  isTypingInBox(event: any, row: Mapping) {
    if (event.keyCode === 13) {
      this.focussedMappingId = 0;
      this.postTextFieldValue(row);
    }
    this.focussedMappingId = row.id;
  }

  postTextFieldValue(data: Mapping) {
    data.destination_value = this.destinationValue;
    const mappingPayload = MappingModel.constructPayload(data);
    this.postMapping.emit(mappingPayload);
    this.focussedMappingId = 0;
  }

  getToolTipText() {
    return `
            <div style="padding:0px 6px 4px;text-align: center;>
              <p style="font-size:12px;padding-top:0">Save</p>
              <p style="margin-top:5px;padding:4px;background: #A9ACBC80;font-size:10px;border-radius: 4px;">${this.operatingSystem === OperatingSystem.MAC ? `return` : `⏎`}<p>
            </div>`;
  }

  ngOnInit(): void {
  }

}
