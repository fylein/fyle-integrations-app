import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { QBDExportSettingGet } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';
import { QbdExportSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-setting.service';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  originModules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/qbd/main/dashboard'},
    {label: 'Configuration', routerLink: '/integrations/qbd/main/configuration'},
    {label: 'Mapping', routerLink: '/integrations/qbd/main/mapping'}
  ];

  modules: MenuItem[];

  activeModule: MenuItem;

  constructor(
    private router: Router,
    private mappingService: QbdMappingService,
    private qbdservice: QbdExportSettingService
  ) {
    this.mappingService.getMappingPagesForSideNavBar.subscribe((showMapping: Boolean) => {
      if (showMapping) {
        this.modules = this.originModules;
      } else {
        const module = this.originModules.filter(item => item.label !== 'Mapping');
        this.modules = module;
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
      this.activeModule = this.modules[0];
      this.router.navigateByUrl(this.modules[0].routerLink);
    });
  }

}
function QBDExportSettingGet(error: any): void {
  throw new Error('Function not implemented.');
}

