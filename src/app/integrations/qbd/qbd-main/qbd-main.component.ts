import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { QBDExportSettingGet } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { QbdExportSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-setting.service';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';

@Component({
  selector: 'app-main',
  templateUrl: './qbd-main.component.html',
  styleUrls: ['./qbd-main.component.scss']
})
export class QbdMainComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/qbd/main/dashboard'},
    {label: 'Configuration', routerLink: '/integrations/qbd/main/configuration'},
    {label: 'Mapping', routerLink: '/integrations/qbd/main/mapping'}
  ];

  activeModules: MenuItem[];

  activeModule: MenuItem;

  appName: AppName = AppName.QBD;

  constructor(
    private router: Router,
    private mappingService: QbdMappingService,
    private qbdservice: QbdExportSettingService
  ) {
    this.mappingService.getMappingPagesForSideNavBar.subscribe((showMapping: Boolean) => {
      if (showMapping) {
        this.activeModules = this.modules;
      } else {
        const module = this.modules.filter(item => item.label !== 'Mapping');
        this.activeModules = module;
      }
    });
  }

  ngOnInit(): void {
    // this.qbdservice.getQbdExportSettings().subscribe((exportSetting: QBDExportSettingGet) => {
    //   if (exportSetting.credit_card_expense_state) {
    //     this.mappingService.getMappingPagesForSideNavBar.emit(true);
    //   } else {
    //     this.mappingService.getMappingPagesForSideNavBar.emit(false);
    //   }
    // get current route
    const currentRoute = this.router.url;
    console.log('currentRoute', currentRoute);
    if (currentRoute.includes('mapping')) {
      this.activeModule = this.activeModules[2];
      this.router.navigateByUrl(this.activeModules[2].routerLink);
    } else {
      this.activeModule = this.activeModules[0];
      this.router.navigateByUrl(this.activeModules[0].routerLink);
    }
    // });
  }

}
