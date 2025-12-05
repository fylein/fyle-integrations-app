import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';

@Component({
    selector: 'app-sub-menu',
    templateUrl: './sub-menu.component.html',
    styleUrls: ['./sub-menu.component.scss'],
    standalone: false
})
export class SubMenuComponent implements OnInit {

  @Input() modules: TabMenuItem[];

  @Input() activeModule: string;

  @Output() activeModuleChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() shouldRedirect: boolean = true;

  @Input() customStyles: string = '';

  constructor(
    private router: Router
  ) { }

  onTabChange(value: any): void {
    const stringValue = String(value);
    this.activeModule = stringValue;
    this.activeModuleChange.emit(stringValue);

    // Navigate to the selected tab's route
    const selectedModule = this.modules.find(m => m.value === stringValue);
    if (selectedModule?.routerLink) {
      this.router.navigateByUrl(selectedModule.routerLink);
    }
  }

  ngOnInit(): void {
    if (!this.shouldRedirect) {
      return;
    }
    // Redirect to the first module (tab) if the if a full path is not specified in the url
    // Eg: /integrations/xero/main/configuration, /integrations/xero/main/mapping
    // Skips redirection if the child route is also specified
    // Eg: /integrations/xero/main/configuration/advanced_settings, /integrations/xero/main/mapping/category
    const validPaths = this.modules.map(module => module.routerLink?.replace(/\/$/, '') || '');
    if (!validPaths.includes(this.router.url.replace(/\/$/, ''))) {
      const firstRouterLink = this.modules[0].routerLink;
      if (firstRouterLink) {
        this.router.navigateByUrl(firstRouterLink);
      }
    }

    const activeModules = this.modules.find(module => this.router.url.includes(module.routerLink || ''));
    // This.activeModule = activeModules ? activeModules.value : this.modules[0].value;
  }
}
