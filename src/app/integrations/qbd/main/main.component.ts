import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/qbd/main/dashboard'},
    {label: 'Configuration', routerLink: '/integrations/qbd/main/configuration'},
    {label: 'Mapping', routerLink: '/integrations/qbd/main/mapping'}
  ];

  originModules: MenuItem[] = this.modules.concat()

  activeModule: MenuItem;

  constructor(
    private router: Router,
    private mappingService: QbdMappingService
  ) { 
    this.mappingService.getMappingPagesForSideNavBar.subscribe((showMapping: Boolean) => {
      if (showMapping) {
        this.modules = this.originModules
      }
      else {
        const module = this.modules.filter(item => item.label !== 'Mapping')
        this.modules = module
      }
    });
  }

  ngOnInit(): void {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}
