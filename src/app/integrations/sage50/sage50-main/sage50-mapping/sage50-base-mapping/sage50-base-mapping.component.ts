import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig } from 'src/app/branding/branding-config';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { AppName, FyleField, Sage50AttributeType } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { TranslocoService } from '@jsverse/transloco';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage50ImportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-import-settings.service';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { Sage50ImportableField } from 'src/app/core/models/sage50/sage50-configuration/sage50-import-settings.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sage50-base-mapping',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './sage50-base-mapping.component.html',
  styleUrls: ['./sage50-base-mapping.component.scss']
})
export class Sage50BaseMappingComponent implements OnInit {

  isLoading: boolean = true;

  destinationOptions: DestinationAttribute[];

  employeeFieldMapping: FyleField;

  sourceField: string;

  destinationField: string;

  AppName = AppName;

  FyleField = FyleField;

  isMultiLineOption: boolean;

  brandingConfig = brandingConfig;

  destinationAttributes: string | string[];

  constructor(
    private route: ActivatedRoute,
    private mappingService: MappingService,
    private toastService: IntegrationsToastService,
    private importSettingsService: Sage50ImportSettingsService,
    private exportSettingsService: Sage50ExportSettingsService,
    private translocoService: TranslocoService
  ) { }

  private getDestinationField(mappingSettings: MappingSetting[]): string {
    if (this.sourceField === FyleField.EMPLOYEE) {
      return Sage50AttributeType.VENDOR;
    } else if (this.sourceField === FyleField.CATEGORY) {
      return Sage50AttributeType.ACCOUNT;
    }

    return mappingSettings.find((setting) => setting.source_field === this.sourceField)?.destination_field || '';
  }

  private setupPage(): void {
    const sourceFieldParam = this.route.snapshot.params.source_field;
    if (!sourceFieldParam) {
      this.isLoading = false;
      return;
    }

    this.sourceField = decodeURIComponent(sourceFieldParam).toUpperCase();
    forkJoin([
      this.mappingService.getMappingSettings(),
      this.exportSettingsService.getExportSettings(),
      this.importSettingsService.getSage50ImportSettings()
    ]).subscribe((responses) => {
      this.employeeFieldMapping = FyleField.VENDOR;
      this.destinationField = this.getDestinationField(responses[0].results);
      this.destinationAttributes = this.destinationField;

      this.isMultiLineOption = responses[2]?.import_settings?.import_code_fields?.includes(this.destinationField as Sage50ImportableField) || false;

      this.mappingService.getPaginatedDestinationAttributes(this.destinationAttributes, undefined, undefined).subscribe((responses) => {
        this.destinationOptions = responses.results;
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

