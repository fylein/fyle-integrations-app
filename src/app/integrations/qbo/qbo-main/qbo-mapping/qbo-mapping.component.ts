import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { FyleField } from 'src/app/core/models/enum/enum.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
  selector: 'app-qbo-mapping',
  templateUrl: './qbo-mapping.component.html',
  styleUrls: ['./qbo-mapping.component.scss']
})
export class QboMappingComponent implements OnInit {

  isLoading: boolean = true;

  mappingPages: MenuItem[] = [
    {label: 'Employee', routerLink: '/integrations/qbo/main/mapping/employee'},
    {label: 'Category', routerLink: '/integrations/qbo/main/mapping/category'}
  ];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private mappingService: MappingService,
    private router: Router
  ) { }

  private setupPage(): void {
    this.mappingService.getMappingSettings().subscribe((response) => {
      if (response.results && Array.isArray(response.results)) {
        response.results.forEach((item) => {
          if (item.source_field !== FyleField.EMPLOYEE && item.source_field !== FyleField.CATEGORY) {
            this.mappingPages.push({
              label: new TitleCasePipe().transform(new SnakeCaseToSpaceCasePipe().transform(item.source_field)),
              routerLink: `/integrations/qbo/main/mapping/${item.source_field.toLowerCase()}`
            });
          }
        });
      }
      if (!brandingFeatureConfig.featureFlags.mapEmployees) {
        this.mappingPages.splice(0, 1);
      }
      this.router.navigateByUrl(this.mappingPages[0].routerLink);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
