import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbd-mapping',
  templateUrl: './qbd-mapping.component.html',
  styleUrls: ['./qbd-mapping.component.scss'],
  standalone: false,
})
export class QbdMappingComponent implements OnInit {
  mappingPages: TabMenuItem[];

  activeModule: string;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.mappingPages = [
      {
        label: this.translocoService.translate('qbdMapping.corporateCardLabel'),
        routerLink: '/integrations/qbd/main/mapping/corporate_card',
        value: 'corporate_card',
      },
      {
        label: this.translocoService.translate('qbdMapping.itemLabel'),
        routerLink: '/integrations/qbd/main/mapping/item',
        value: 'item',
      },
    ];
    this.activeModule = this.mappingPages[0].value;
    this.router.navigateByUrl(this.mappingPages[0].routerLink!);
  }
}
