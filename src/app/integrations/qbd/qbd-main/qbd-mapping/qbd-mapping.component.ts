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
    {label: 'Corporate Card', routerLink: '/integrations/qbd/main/mapping/corporate_card'},
    {label: 'Item', routerLink: '/integrations/qbd/main/mapping/item'}
  ];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private router: Router
  ) { }

  isSpotlightOpen = false;

  toggleSpotlight(): void {
    this.isSpotlightOpen = !this.isSpotlightOpen;
  }

  selectOption(event: any): void {
    // Handle the selected option from the spotlight
    console.log('Selected option:', event);
    // Implement the logic for handling the selected option
  }

  ngOnInit(): void {
    this.activeModule = this.mappingPages[0];
    this.router.navigateByUrl(this.mappingPages[0].routerLink);
  }

}
