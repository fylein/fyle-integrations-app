import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType, OperatingSystem } from 'src/app/core/models/enum/enum.model';
import { QBDMapping, QBDMappingModel, QBDMappingPost } from 'src/app/core/models/qbd/db/qbd-mapping.model';
import { EmployeeMapping } from 'src/app/core/models/intacct/db/employee-mapping.model';
import { MappingIntacct, MappingResponse, MappingStats } from 'src/app/core/models/intacct/db/mapping.model';
import { brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbd-mapping-table',
  templateUrl: './qbd-mapping-table.component.html',
  styleUrls: ['./qbd-mapping-table.component.scss']
})
export class QbdMappingTableComponent implements OnInit {

  @Input() mappings!: QBDMapping[] | EmployeeMapping[];

  @Input() destinationFieldType: FieldType;

  @Input() fyleHeaderName: string;

  @Input() destinationHeaderName: string;

  @Input() operatingSystem: string;

  @Output() postMapping = new EventEmitter<QBDMappingPost>();

  allOS = OperatingSystem;

  focussedMappingId: number;

  destinationValue: string;

  fieldType = FieldType;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    public route: ActivatedRoute,
    private translocoService: TranslocoService
  ) { }

  onTextBoxChange(event: any): void {
    const targetValue: string = event.target.value;
    this.destinationValue = targetValue;
  }

  isTypingInBox(event: any, row: QBDMapping): void {
    if (event.keyCode === 13) {
      this.focussedMappingId = 0;
      this.postTextFieldValue(row);
    } else {
      this.focussedMappingId = row.id;
    }
  }

  postTextFieldValue(data: QBDMapping): void {
    data.destination_value = this.destinationValue.length > 0 ? this.destinationValue : null;
    const mappingPayload = QBDMappingModel.constructPayload(data);
    this.postMapping.emit(mappingPayload);
    this.focussedMappingId = 0;
  }

  getPlaceholder(): string {
    const value = this.route.snapshot.params.source_field === 'corporate_card' ? this.translocoService.translate('qbdMappingTable.creditCardAccount') : this.translocoService.translate('qbdMappingTable.account');
    return this.translocoService.translate('qbdMappingTable.enterValue', { value: value });
  }

  getToolTipText(): string {
    const saveText = this.translocoService.translate('qbdMappingTable.save');
    const returnKeyText = this.translocoService.translate('qbdMappingTable.returnKey');
    return `
            <div style="padding:0px 6px 4px;text-align: center;>
              <p style="font-size:12px;padding-top:0">${saveText}</p>
              <p style="margin-top:5px;padding:4px;background: #A9ACBC80;font-size:10px;border-radius: 4px;">${this.operatingSystem === OperatingSystem.MAC ? returnKeyText : `⏎`}<p>
            </div>`;
  }

  ngOnInit(): void {
  }

}
