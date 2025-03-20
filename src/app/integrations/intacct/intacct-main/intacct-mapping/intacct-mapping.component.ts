import { TitleCasePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { FyleField } from 'src/app/core/models/enum/enum.model';
import { CommonResourcesService } from 'src/app/core/services/common/common-resources.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
  selector: 'app-intacct-mapping',
  templateUrl: './intacct-mapping.component.html',
  styleUrls: ['./intacct-mapping.component.scss']
})
export class IntacctMappingComponent implements OnInit {

  isLoading: boolean = true;

  mappingPages: MenuItem[] = [
    {label: 'Employee', routerLink: '/integrations/intacct/main/mapping/employee'},
    {label: 'Category', routerLink: '/integrations/intacct/main/mapping/category'}
  ];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private mappingService: SiMappingsService,
    private commonResourcesService: CommonResourcesService
  ) { }

  private setupPages(): void {

    if (!brandingFeatureConfig.featureFlags.mapEmployees) {
      this.mappingPages.splice(0, 1);
    }
    this.router.navigateByUrl(this.mappingPages[0].routerLink);

    this.mappingService.getMappingSettings().subscribe((response) => {
      if (response.results && Array.isArray(response.results)) {

        const attributeTypes = response.results.map((item) => item.source_field);
        this.commonResourcesService.getDimensionDetails({sourceType: 'FYLE', attributeTypes}).subscribe((dimensionDetails) => {
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

              const displayName = dimensionDetails.results.find((detail) => detail.attribute_type === item.source_field)?.display_name;

              let label;
              if (displayName) {
                label = displayName;
              } else if (brandingFeatureConfig.featureFlags.exportSettings.transformContentToSentenceCase) {
                label = new SentenceCasePipe().transform(mappingPage);
              } else {
                label = new TitleCasePipe().transform(mappingPage);
              }

              this.mappingPages.push({
                label,
                routerLink: `/integrations/intacct/main/mapping/${encodeURIComponent(item.source_field.toLowerCase())}`
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
    this.activeModule = this.mappingPages[0];
    this.setupPages();
  }

}
