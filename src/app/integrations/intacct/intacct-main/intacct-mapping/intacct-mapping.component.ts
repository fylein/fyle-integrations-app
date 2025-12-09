import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { FyleField } from 'src/app/core/models/enum/enum.model';
import { CommonResourcesService } from 'src/app/core/services/common/common-resources.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-intacct-mapping',
  templateUrl: './intacct-mapping.component.html',
  styleUrls: ['./intacct-mapping.component.scss'],
  standalone: false,
})
export class IntacctMappingComponent implements OnInit {
  isLoading: boolean = true;

  mappingPages: TabMenuItem[];

  activeModule: string;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private mappingService: SiMappingsService,
    private commonResourcesService: CommonResourcesService,
    private translocoService: TranslocoService,
  ) {}

  private setupPages(): void {
    if (!brandingFeatureConfig.featureFlags.mapEmployees) {
      this.mappingPages.splice(0, 1);
    }
    this.router.navigateByUrl(this.mappingPages[0].routerLink!);

    this.mappingService.getMappingSettings().subscribe((response) => {
      if (response.results && Array.isArray(response.results)) {
        const sourceAttributeTypes = response.results.map((item) => item.source_field);
        const destinationAttributeTypes = response.results.map((item) => item.destination_field);

        forkJoin({
          sourceDimensionDetails: this.commonResourcesService.getDimensionDetails({
            sourceType: 'FYLE',
            attributeTypes: sourceAttributeTypes,
          }),
          // This response will be cached and used in IntacctBaseMappingComponent
          destinationDimensionDetails: this.commonResourcesService.getDimensionDetails({
            sourceType: 'ACCOUNTING',
            attributeTypes: destinationAttributeTypes,
            keepOldCache: true,
          }),
        }).subscribe(({ sourceDimensionDetails }) => {
          /**
           * For every mapping
           * 1. Get the source_field
           * 2. Check if the source_field has a display name in dimension details
           *   - If it does, use the display name
           *   - If it doesn't, use the source_field (space cased and sentence cased)
           */
          response.results.forEach((item) => {
            if (item.source_field !== FyleField.EMPLOYEE && item.source_field !== FyleField.CATEGORY) {
              const mappingPage = new SnakeCaseToSpaceCasePipe().transform(item.source_field);

              const displayName = sourceDimensionDetails.results.find(
                (detail) => detail.attribute_type === item.source_field,
              )?.display_name;

              let label;
              if (displayName) {
                label = displayName;
              } else {
                label = new SentenceCasePipe(this.translocoService).transform(mappingPage);
              }

              this.mappingPages.push({
                label,
                routerLink: `/integrations/intacct/main/mapping/${encodeURIComponent(item.source_field.toLowerCase())}`,
                value: 'mapping_' + item.source_field.toLowerCase(),
              });
            }
          });
          this.isLoading = false;
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.mappingPages = [
      {
        label: this.translocoService.translate('intacctMapping.employeeLabel'),
        routerLink: '/integrations/intacct/main/mapping/employee',
        value: 'employee',
      },
      {
        label: this.translocoService.translate('intacctMapping.categoryLabel'),
        routerLink: '/integrations/intacct/main/mapping/category',
        value: 'category',
      },
    ];
    this.activeModule = this.mappingPages[0].value;
    this.setupPages();
  }
}
