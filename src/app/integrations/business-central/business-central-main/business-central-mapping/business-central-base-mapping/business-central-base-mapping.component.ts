import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BusinessCentralExportSettingGet } from 'src/app/core/models/business-central/business-central-configuration/business-central-export-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { AccountingField, AppName, FyleField, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-business-central-base-mapping',
  templateUrl: './business-central-base-mapping.component.html',
  styleUrls: ['./business-central-base-mapping.component.scss'],
  standalone: false,
})
export class BusinessCentralBaseMappingComponent implements OnInit {
  sourceField: string;

  destinationField: string;

  isLoading: boolean = true;

  showAutoMapEmployee: boolean = false;

  reimbursableExpenseObject: string;

  cccExpenseObject: string;

  employeeFieldMapping: FyleField;

  destinationOptions: DestinationAttribute[];

  appName = AppName;

  constructor(
    private route: ActivatedRoute,
    private mappingService: MappingService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService,
  ) {}

  triggerAutoMapEmployees() {
    this.isLoading = true;
    this.mappingService.triggerAutoMapEmployees().subscribe(
      () => {
        this.isLoading = false;
        this.toastService.displayToastMessage(
          ToastSeverity.INFO,
          this.translocoService.translate('businessCentralBaseMapping.autoMappingInProgress'),
        );
      },
      () => {
        this.isLoading = false;
        this.toastService.displayToastMessage(
          ToastSeverity.ERROR,
          this.translocoService.translate('businessCentralBaseMapping.autoMappingError'),
        );
      },
    );
  }

  private getDestinationField(
    exportSetting: BusinessCentralExportSettingGet,
    mappingSettings: MappingSetting[],
  ): string {
    if (this.sourceField === FyleField.EMPLOYEE) {
      return exportSetting.employee_field_mapping;
    } else if (this.sourceField === FyleField.CATEGORY) {
      return AccountingField.ACCOUNT;
    }

    return mappingSettings.find((setting) => setting.source_field === this.sourceField)?.destination_field || '';
  }

  setupPage(): void {
    this.sourceField = decodeURIComponent(this.route.snapshot.params.source_field.toUpperCase());

    forkJoin([this.mappingService.getMappingSettings(), this.mappingService.getExportSettings()]).subscribe(
      ([mappingSettingsResponse, exportSettingsResponse]) => {
        this.destinationField = this.getDestinationField(exportSettingsResponse, mappingSettingsResponse.results);
        this.employeeFieldMapping = exportSettingsResponse.employee_field_mapping as unknown as FyleField;
        this.reimbursableExpenseObject = exportSettingsResponse.reimbursable_expenses_object;
        this.cccExpenseObject = exportSettingsResponse.corporate_credit_card_expenses_object;
        this.showAutoMapEmployee = exportSettingsResponse.auto_map_employees ? true : false;

        this.mappingService
          .getPaginatedDestinationAttributes(this.destinationField)
          .subscribe((destinationAttributesResponse: any) => {
            this.destinationOptions = destinationAttributesResponse.results;
            this.isLoading = false;
          });
      },
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.isLoading = true;
      this.setupPage();
    });
  }
}
