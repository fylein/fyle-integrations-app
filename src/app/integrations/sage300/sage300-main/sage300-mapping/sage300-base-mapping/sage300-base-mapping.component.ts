import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { AppName, FyleField, IntegrationName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';

@Component({
  selector: 'app-sage300-base-mapping',
  templateUrl: './sage300-base-mapping.component.html',
  styleUrls: ['./sage300-base-mapping.component.scss']
})
export class Sage300BaseMappingComponent implements OnInit {

  sourceField: string;

  destinationField: string;

  isLoading: boolean = true;

  showAutoMapEmployee: boolean = false;

  reimbursableExpenseObject: string;

  cccExpenseObject: string;

  employeeFieldMapping: FyleField = FyleField.VENDOR;

  destinationOptions: DestinationAttribute[];

  AppName = AppName;

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

  getSourceType(results: MappingSetting[]) {
    if (this.sourceField==='EMPLOYEE') {
      return 'VENDOR';
    } else if (this.sourceField==='CATEGORY') {
      return 'ACCOUNT';
    }
    const destinationField = results.find((field) => field.source_field === this.sourceField)?.destination_field;
    return destinationField ? destinationField : '';
  }

  setupPage(): void {
    this.sourceField = this.route.snapshot.params.source_field.toUpperCase();
    forkJoin(
      this.mappingService.getExportSettings(),
      this.mappingService.getMappingSettings()
    ).subscribe(([exportSettingsResponse, mappingSettingsResponse]) => {
      this.reimbursableExpenseObject = exportSettingsResponse.reimbursable_expenses_object;
      this.cccExpenseObject = exportSettingsResponse.corporate_credit_card_expenses_object;
      this.showAutoMapEmployee = exportSettingsResponse.auto_map_employees ? true : false;
      this.destinationField = this.getSourceType(mappingSettingsResponse.results);
      this.mappingService.getDestinationAttributes([this.destinationField], 'v2').subscribe((response: any) => {
        this.destinationOptions = response;
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