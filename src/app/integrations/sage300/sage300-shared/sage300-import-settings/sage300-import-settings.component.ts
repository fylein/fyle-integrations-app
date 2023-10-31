import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { IntegrationFields } from 'src/app/core/models/db/mapping.model';
import { AppNameInService, FyleField, Sage300Field } from 'src/app/core/models/enum/enum.model';
import { Sage300DestinationAttributes } from 'src/app/core/models/sage300/db/sage300-destination-attribuite.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { Sage300ImportSettingsService } from 'src/app/core/services/sage300/sage300-configuration/sage300-import-settings.service';
import { Sage300HelperService } from 'src/app/core/services/sage300/sage300-helper/sage300-helper.service';

@Component({
  selector: 'app-sage300-import-settings',
  templateUrl: './sage300-import-settings.component.html',
  styleUrls: ['./sage300-import-settings.component.scss']
})
export class Sage300ImportSettingsComponent implements OnInit {

  isOnboarding: boolean;

  importSettings: any;

  importSettingForm: FormGroup;

  isLoading: boolean = true;

  taxGroupOptions: Sage300DestinationAttributes[];

  fyleFields: IntegrationFields[];

  sage300Fields: IntegrationFields[];

  constructor(
    private router: Router,
    private importSettingService: Sage300ImportSettingsService,
    private mappingService: MappingService,
    private helperService: Sage300HelperService
  ) { }

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.importSettingService.getSage300ImportSettings().pipe(catchError(() => of(null))),
      this.mappingService.getFyleFields(),
      this.mappingService.getIntegrationsFields(AppNameInService.SAGE300),
      this.mappingService.getGroupedDestinationAttributes([Sage300Field.TAX_DETAIL], AppNameInService.SAGE300)
    ]).subscribe(([response]) => {
      this.importSettings = response[0];
      // This.importSettingForm = ImportSettingModel.mapAPIResponseToFormGroup(this.importSettings);
      this.fyleFields = response[1];
      this.sage300Fields = response[2];
      this.taxGroupOptions = response[3].TAX_GROUP;
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
