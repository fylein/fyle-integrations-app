import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { QBDExportSettingGet } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { QbdExportSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-setting.service';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-main',
    templateUrl: './qbd-main.component.html',
    styleUrls: ['./qbd-main.component.scss'],
    standalone: false
})
export class QbdMainComponent implements OnInit {

  modules: MenuItem[];

  activeModules: MenuItem[];

  appName: AppName = AppName.QBD;

  constructor(
    private mappingService: QbdMappingService,
    private qbdservice: QbdExportSettingService,
    private translocoService: TranslocoService
  ) {
    this.mappingService.getMappingPagesForSideNavBar.subscribe((showMapping: Boolean) => {
      if (showMapping) {
        this.activeModules = this.modules;
      } else {
        const module = this.modules.filter(item => item.label !== this.translocoService.translate('qbdMain.mappingLabel'));
        this.activeModules = module;
      }
    });
  }

  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('qbdMain.dashboardLabel'), routerLink: '/integrations/qbd/main/dashboard'},
      {label: this.translocoService.translate('qbdMain.configurationLabel'), routerLink: '/integrations/qbd/main/configuration'},
      {label: this.translocoService.translate('qbdMain.mappingLabel'), routerLink: '/integrations/qbd/main/mapping'}
    ];
    this.qbdservice.getQbdExportSettings().subscribe((exportSetting: QBDExportSettingGet) => {
      if (exportSetting.credit_card_expense_state) {
        this.mappingService.getMappingPagesForSideNavBar.emit(true);
      } else {
        this.mappingService.getMappingPagesForSideNavBar.emit(false);
      }
    });
  }

}
