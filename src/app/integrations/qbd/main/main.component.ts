import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/qbd/main/dashboard'},
    {label: 'Configuration', routerLink: '/integrations/qbd/main/configuration'}
  ];

  activeModule: MenuItem;

  constructor() { }

  ngOnInit(): void {
    this.activeModule = this.modules[0];
    this.activeModule.routerLinkActiveOptions = this.modules[0].routerLink;
  }

}
