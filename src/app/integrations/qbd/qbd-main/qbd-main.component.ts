import type { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import type { Router } from '@angular/router';
import type { MenuItem } from 'primeng/api/menuitem';
import { AppName } from 'src/app/core/models/enum/enum.model';
import type { QBDExportSettingGet } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import type { QbdExportSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-setting.service';
import type { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';

@Component({
  selector: 'app-main',
  templateUrl: './qbd-main.component.html',
  styleUrls: ['./qbd-main.component.scss']
})
export class QbdMainComponent implements OnInit {

  modules: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/integrations/qbd/main/dashboard' },
    { label: 'Configuration', routerLink: '/integrations/qbd/main/configuration' },
    { label: 'Mapping', routerLink: '/integrations/qbd/main/mapping' }
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
    this.qbdservice.getQbdExportSettings().subscribe((exportSetting: QBDExportSettingGet) => {
      if (exportSetting.credit_card_expense_state) {
        this.mappingService.getMappingPagesForSideNavBar.emit(true);
      } else {
        this.mappingService.getMappingPagesForSideNavBar.emit(false);
      }
      this.activeModule = this.activeModules[0];
      this.router.navigateByUrl(this.activeModules[0].routerLink);
    });
  }

}
