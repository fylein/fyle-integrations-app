import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.scss']
})
export class SubMenuComponent implements OnInit {

  @Input() modules: MenuItem[];

  @Input() activeModule: MenuItem;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    // Redirect to the first module (tab) if the if a full path is not specified in the url
    // Eg: /integrations/xero/main/configuration, /integrations/xero/main/mapping
    // Skips redirection if the child route is also specified
    // Eg: /integrations/xero/main/configuration/advanced_settings, /integrations/xero/main/mapping/category
    const validPaths = this.modules.map(module => module.routerLink.replace(/\/$/, ''));
    if (!validPaths.includes(this.router.url.replace(/\/$/, ''))) {
      this.router.navigateByUrl(this.modules[0].routerLink);
    }
  }
}
