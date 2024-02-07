import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppName } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-travelperk-main',
  templateUrl: './travelperk-main.component.html',
  styleUrls: ['./travelperk-main.component.scss']
})
export class TravelperkMainComponent implements OnInit {

  appName: AppName = AppName.TRAVELPERK;

  modules: MenuItem[] = [
    {label: 'Configuration', routerLink: '/integrations/travelperk/main/configuration'}
  ];

  activeModule: MenuItem;

  constructor(
    private router: Router
  ) { }

  private setupPage() {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
