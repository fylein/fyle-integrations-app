import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sage300-main',
  templateUrl: './sage300-main.component.html',
  styleUrls: ['./sage300-main.component.scss']
})
export class Sage300MainComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/sage300/sage300-main/sage300-dashboard'},
    {label: 'Export Log', routerLink: '/integrations/sage300/sage300-main/sage300-export_log'},
    {label: 'Mapping', routerLink: '/integrations/sage300/sage300-main/sage300-mapping'},
    {label: 'Configuration', routerLink: '/integrations/sage300/sage300-main/sage300-configuration'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
