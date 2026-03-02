import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { NavigationLockService } from 'src/app/core/services/common/navigation-lock.service';

@Component({
    selector: 'app-sub-menu',
    templateUrl: './sub-menu.component.html',
    styleUrls: ['./sub-menu.component.scss'],
    standalone: false
})
export class SubMenuComponent implements OnInit, OnDestroy {

  @Input() modules: TabMenuItem[];

  @Input() activeModule: string;

  @Output() activeModuleChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() shouldRedirect: boolean = true;

  @Input() customStyles: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    public navigationLockService: NavigationLockService
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
    this.updateActiveModuleFromRoute();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateActiveModuleFromRoute();
      });

    if (!this.shouldRedirect) {
      return;
    }
    // Redirect to the first module (tab) if the if a full path is not specified in the url
    // Eg: /integrations/xero/main/configuration, /integrations/xero/main/mapping
    // Skips redirection if the child route is also specified
    // Eg: /integrations/xero/main/configuration/advanced_settings, /integrations/xero/main/mapping/category
    const validPaths = this.modules.map(module => module.routerLink?.replace(/\/$/, '') || '');
    const currentUrl = this.router.url.replace(/\/$/, '');

    // Check if current URL exactly matches a valid path OR starts with a valid path (for child routes - configuration/qwc_file/new)
    const isValidRoute = validPaths.some(path =>
      currentUrl === path || currentUrl.startsWith(path + '/')
    );

    if (!isValidRoute) {
      const firstRouterLink = this.modules[0].routerLink;
      if (firstRouterLink) {
        this.router.navigateByUrl(firstRouterLink);
      }
    }
  }

  private updateActiveModuleFromRoute(): void {
    const activeModules = this.modules.find(module =>
      module.routerLink && this.router.url.includes(module.routerLink)
    );

    if (activeModules) {
      this.activeModule = activeModules.value;
      this.activeModuleChange.emit(this.activeModule);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
