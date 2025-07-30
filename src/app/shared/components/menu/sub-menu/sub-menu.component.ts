import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-sub-menu',
    templateUrl: './sub-menu.component.html',
    styleUrls: ['./sub-menu.component.scss'],
    standalone: false
})
export class SubMenuComponent implements OnInit {

  @Input() modules: MenuItem[];

  @Input() activeModule: MenuItem;

  activeTabValue: string = '0';

  constructor(
    private router: Router
  ) { }

  navigateToModule(module: MenuItem): void {
    if (module.routerLink && !module.disabled) {
      this.router.navigateByUrl(module.routerLink);
    }
  }

  private calculateActiveTab(): void {
    if (this.modules && this.modules.length > 0) {
      const currentUrl = this.router.url;

      // Find the active tab based on the current route
      const activeIndex = this.modules.findIndex(module => {
        if (module.routerLink) {
          // Handle array of route segments
          if (Array.isArray(module.routerLink)) {
            return currentUrl.includes(module.routerLink.join('/'));
          }
          // Handle string route
          return currentUrl.includes(module.routerLink);
        }
        return false;
      });

      this.activeTabValue = activeIndex >= 0 ? activeIndex.toString() : '0';
    }
  }

  ngOnInit(): void {
    // Redirect to the first module (tab) if the if a full path is not specified in the url
    // Eg: /integrations/xero/main/configuration, /integrations/xero/main/mapping
    // Skips redirection if the child route is also specified
    // Eg: /integrations/xero/main/configuration/advanced_settings, /integrations/xero/main/mapping/category
    const validPaths = this.modules.map(module => module.routerLink.replace(/\/$/, ''));
    if (!validPaths.includes(this.router.url.replace(/\/$/, ''))) {
      this.router.navigateByUrl(this.modules[0].routerLink);
    }

    // Calculate the active tab based on current route
    this.calculateActiveTab();

    // Listen to route changes to update active tab
    this.router.events.subscribe(() => {
      this.calculateActiveTab();
    });
  }
}
