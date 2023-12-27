import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BusinessCentralExportSettingGet } from 'src/app/core/models/business-central/business-central-configuration/business-central-export-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { AccountingField, FyleField, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { QBOWorkspaceGeneralSetting } from 'src/app/core/models/qbo/db/workspace-general-setting.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';

@Component({
  selector: 'app-business-central-base-mapping',
  templateUrl: './business-central-base-mapping.component.html',
  styleUrls: ['./business-central-base-mapping.component.scss']
})
export class BusinessCentralBaseMappingComponent implements OnInit {

  sourceField: string;

  destinationField: string;

  isLoading: boolean = true;

  showAutoMapEmployee: boolean = false;

  reimbursableExpenseObject: string;

  cccExpenseObject: string;

  employeeFieldMapping: FyleField = FyleField.VENDOR;

  destinationOptions: DestinationAttribute[];

  constructor(
    private route: ActivatedRoute,
    private mappingService: MappingService,
    private toastService: IntegrationsToastService
  ) { }

  triggerAutoMapEmployees() {
    this.isLoading = true;
    this.mappingService.triggerAutoMapEmployees().subscribe(() => {
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Auto mapping of employees may take few minutes');
    }, () => {
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong, please try again');
    });
  }

  private getDestinationField(exportSetting: BusinessCentralExportSettingGet, mappingSettings: MappingSetting[]): string {
    if (this.sourceField === FyleField.EMPLOYEE) {
      return exportSetting.employee_mapping;
    } else if (this.sourceField === FyleField.CATEGORY) {
      return AccountingField.ACCOUNT;
    }

    return mappingSettings.find((setting) => setting.source_field === this.sourceField)?.destination_field || '';
  }

  setupPage(): void {
    this.sourceField = this.route.snapshot.params.source_field.toUpperCase();

    forkJoin([
      this.mappingService.getMappingSettings(),
      this.mappingService.getExportSettings()
    ]).subscribe(([mappingSettingsResponse, exportSettingsResponse]) => {
      this.destinationField = this.getDestinationField(exportSettingsResponse, mappingSettingsResponse.results);

      this.reimbursableExpenseObject = exportSettingsResponse.reimbursable_expenses_object;
      this.cccExpenseObject = exportSettingsResponse.corporate_credit_card_expenses_object;
      this.showAutoMapEmployee = exportSettingsResponse.auto_map_employees ? true : false;

      this.mappingService
        .getDestinationAttributes(this.destinationField, 'v2', undefined, undefined, undefined, undefined
        )
        .subscribe((destinationAttributesResponse: any) => {
          this.destinationOptions = destinationAttributesResponse;
          this.isLoading = false;
        });
    });
  }


  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.isLoading = true;
      this.setupPage();
    });
  }

}
