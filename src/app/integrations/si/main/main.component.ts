import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/intacct/main/dashboard'},
    {label: 'Export Log', routerLink: '/integrations/intacct/main/export_log'},
    {label: 'Mapping', routerLink: '/integrations/intacct/main/mapping'},
    {label: 'Configuration', routerLink: '/integrations/intacct/main/configuration'}
  ];

  activeModule: MenuItem;

  constructor(
    private router: Router,
    private mappingsService: SiMappingsService
  ) { }

  refreshSageIntacctDimension() {
    this.mappingsService.refreshSageIntacctDimensions().subscribe();
  }

  ngOnInit(): void {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}
