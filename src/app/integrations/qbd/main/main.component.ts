import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  items: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/qbd/main/dashboard'},
    {label: 'Configuration', routerLink: '/integrations/qbd/main/configuration'}
  ];

  activeItem: MenuItem;

  constructor() { }

  ngOnInit(): void {
    this.activeItem = this.items[0];
    this.activeItem.routerLinkActiveOptions = this.items[0].routerLink;
  }

}
