import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ExportSettingFormOption } from 'src/app/core/models/si/si-configuration/export-settings.model';
import { ClickEvent, CorporateCreditCardExpensesObject, IntacctReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { PreviewPage } from 'src/app/core/models/misc/preview-page.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { AdvancedSettingFormOption, HourOption } from 'src/app/core/models/si/si-configuration/advanced-settings.model';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-configuration-select-field',
  templateUrl: './configuration-select-field.component.html',
  styleUrls: ['./configuration-select-field.component.scss']
})
export class ConfigurationSelectFieldComponent implements OnInit {

  @Input() options: QBDExportSettingFormOption[] | string[] | ExportSettingFormOption[] | AdvancedSettingFormOption[] | HourOption[];

  @Input() destinationAttributes: DestinationAttribute[];

  @Input() form: FormGroup;

  @Input() iconPath: string;

  @Input() label: string;

  @Input() subLabel: string | SafeHtml;

  @Input() placeholder: string;

  @Input() formControllerName: string;

  @Input() simpleOptions: string[];

  @Input() isFieldMandatory: boolean;

  @Input() mandatoryErrorListName: string;

  @Input() customErrorMessage: string;

  meridiemOption: string[] = ['AM', 'PM'];

  timeOption: string[] = ['01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];

  constructor(
    private trackingService: TrackingService
  ) { }

  ngOnInit(): void {}

  showIntacctExportTable(reimbursableExportType: IntacctReimbursableExpensesObject | null, creditCardExportType: CorporateCreditCardExpensesObject | null): void {
    const data: PreviewPage = {
      intacctReimburse: reimbursableExportType,
      intacctCCC: creditCardExportType
    };

    this.trackingService.onClickEvent(ClickEvent.PREVIEW_INTACCT_EXPORT);
  }

  showDialog() {
    console.log('abcd');
  }
}
