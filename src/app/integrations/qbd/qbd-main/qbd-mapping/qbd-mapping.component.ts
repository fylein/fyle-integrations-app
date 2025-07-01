import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbd-mapping',
  templateUrl: './qbd-mapping.component.html',
  styleUrls: ['./qbd-mapping.component.scss']
})
export class QbdMappingComponent implements OnInit {

  mappingPages: MenuItem[];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.mappingPages = [
      {label: this.translocoService.translate('qbdMapping.corporateCardLabel'), routerLink: '/integrations/qbd/main/mapping/corporate_card'},
      {label: this.translocoService.translate('qbdMapping.itemLabel'), routerLink: '/integrations/qbd/main/mapping/item'}
    ];
    this.activeModule = this.mappingPages[0];
    this.router.navigateByUrl(this.mappingPages[0].routerLink);
  }

}
