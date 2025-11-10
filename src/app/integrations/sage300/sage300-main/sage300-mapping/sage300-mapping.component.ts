import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { FyleField } from 'src/app/core/models/enum/enum.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-sage300-mapping',
    templateUrl: './sage300-mapping.component.html',
    styleUrls: ['./sage300-mapping.component.scss'],
    standalone: false
})
export class Sage300MappingComponent implements OnInit {

  isLoading: boolean;

  mappingPages: TabMenuItem[];

  activeModule: string;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private router: Router,
    private mappingService: MappingService,
    private translocoService: TranslocoService
  ) { }

  private setupPage(): void {
    this.isLoading = true;
    this.mappingPages = [
      {label: this.translocoService.translate('sage300Mapping.employeeLabel'), routerLink: '/integrations/sage300/main/mapping/employee', value: 'employee'},
      {label: this.translocoService.translate('sage300Mapping.categoryLabel'), routerLink: '/integrations/sage300/main/mapping/category', value: 'category'}
    ];
    this.mappingService.getMappingSettings().subscribe((response) => {
      if (response.results && Array.isArray(response.results)) {
        response.results.forEach((item) => {
          if (item.source_field!==FyleField.EMPLOYEE && item.source_field!=='CATEGORY' && item.source_field !== 'PROJECT') {
            this.mappingPages.push({
              label: new SentenceCasePipe(this.translocoService).transform(new SnakeCaseToSpaceCasePipe().transform(item.source_field)),
              routerLink: `/integrations/sage300/main/mapping/${encodeURIComponent(item.source_field.toLowerCase())}`,
              value: 'mapping'
            });
          }
        });
      }
      this.router.navigateByUrl(this.mappingPages[0].routerLink!);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
