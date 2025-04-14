import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-qbd-mapping',
  templateUrl: './qbd-mapping.component.html',
  styleUrls: ['./qbd-mapping.component.scss']
})
export class QbdMappingComponent implements OnInit {

  mappingPages: MenuItem[] = [
    {label: 'Corporate card', routerLink: '/integrations/qbd/main/mapping/corporate_card'},
    {label: 'Item', routerLink: '/integrations/qbd/main/mapping/item'}
  ];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activeModule = this.mappingPages[0];
    this.router.navigateByUrl(this.mappingPages[0].routerLink);
  }

}
