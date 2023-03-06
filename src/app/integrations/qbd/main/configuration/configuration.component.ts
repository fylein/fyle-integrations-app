import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ClickEvent, Page } from 'src/app/core/models/enum/enum.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Export Settings', routerLink: '/integrations/qbd/main/configuration/export_settings'},
    {label: 'Field Mapping', routerLink: '/integrations/qbd/main/configuration/field_mapping'},
    {label: 'Advanced Settings', routerLink: '/integrations/qbd/main/configuration/advanced_settings'}
  ];

  activeModule: MenuItem;

  private sessionStartTime = new Date();

  constructor(
    private router: Router,
    private trackingService: TrackingService
  ) { }

  ngOnInit(): void {
    this.trackingService.onClickEvent(ClickEvent.CONFIGURE_QBD);
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
    this.trackingService.trackTimeSpent(Page.CONFIGURE_QBD, this.sessionStartTime);
  }


}
