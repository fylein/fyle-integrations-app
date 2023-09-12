import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppName, FieldType, OperatingSystem } from 'src/app/core/models/enum/enum.model';
import { Mapping, MappingModel, MappingPost } from 'src/app/core/models/qbd/db/mapping.model';

@Component({
  selector: 'app-mapping-table',
  templateUrl: './mapping-table.component.html',
  styleUrls: ['./mapping-table.component.scss']
})
export class MappingTableComponent implements OnInit {

  @Input() mappings!: Mapping[];

  @Input() destinationFieldType: FieldType;

  @Input() appName: AppName;

  @Input() operatingSystem: string;

  @Output() postMapping = new EventEmitter<MappingPost>();

  @ViewChild('customTooltip') customTooltip: any;

  allOS = OperatingSystem;

  isSelectedRow: number;

  destinationValue: string;

  fieldType = FieldType;

  constructor() { }

  onTextBoxChange(event: any, index: number) {
    const tragetValue: string = event.target.value;
    this.destinationValue = tragetValue;
  }

  isTypingInBox(event: any, row: Mapping) {
    if (event.keyCode === 13) {
      this.isSelectedRow = 0;
      this.saveRow(row);
    }
    this.isSelectedRow = row.id;
  }

  saveRow(data: Mapping) {
    data.destination_value = this.destinationValue;
    const mappingPayload = MappingModel.constructPayload(data);
    this.postMapping.emit(mappingPayload);
    this.isSelectedRow = 0;
  }

  getToolTip() {
    if (this.operatingSystem === OperatingSystem.MAC) {
      return '<div style="padding:0px 6px 4px;text-align: center;><p style="font-size:12px;padding-top:0">Save</p><p style="margin-top:5px;padding:4px;background: #A9ACBC80;font-size:10px;border-radius: 4px;">return<p></div>';
    }
    return '<div style="padding:0px 6px 4px;text-align: center;><p style="font-size:12px;padding-top:0">Save</p><p style="margin-top:5px;padding:4px;background: #A9ACBC80;font-size:10px;border-radius: 4px;">⏎<p></div>';
  }

  ngOnInit(): void {
  }

}
