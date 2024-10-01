import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { brandingConfig } from 'src/app/branding/c1-contents-config';
import { FyleField } from 'src/app/core/models/enum/enum.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-mapping',
  standalone: true,
  imports: [RouterModule, SharedModule, CommonModule],
  templateUrl: './qbd-direct-mapping.component.html',
  styleUrl: './qbd-direct-mapping.component.scss'
})
export class QbdDirectMappingComponent implements OnInit {

  isLoading: boolean = true;

  mappingPages: MenuItem[] = [
    {label: 'Employee', routerLink: '/integrations/qbd_direct/main/mapping/employee'},
    {label: 'Category', routerLink: '/integrations/qbd_direct/main/mapping/category'}
  ];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  constructor(
    private mappingService: MappingService,
    private router: Router
  ) { }

  private setupPage(): void {
    // This.mappingService.getMappingSettings().subscribe((response) => {
    //   If (response.results && Array.isArray(response.results)) {
    //     Response.results.forEach((item) => {
    //       If (item.source_field !== FyleField.EMPLOYEE && item.source_field !== FyleField.CATEGORY) {
    //         Const mappingPage = new SnakeCaseToSpaceCasePipe().transform(item.source_field);
    //         This.mappingPages.push({
    //           Label: brandingConfig.brandId === 'co' ? new SentenceCasePipe().transform(mappingPage) : new TitleCasePipe().transform(mappingPage),
    //           RouterLink: `/integrations/qbd_direct/main/mapping/${encodeURIComponent(item.source_field.toLowerCase())}`
    //         });
    //       }
    //     });
    //   }
    //   If (!brandingFeatureConfig.featureFlags.mapEmployees) {
    //     This.mappingPages.splice(0, 1);
    //   }
      this.router.navigateByUrl(this.mappingPages[0].routerLink);
      this.isLoading = false;
    // });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
