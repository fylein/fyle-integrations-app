import { Inject, Injectable } from '@angular/core';
import type { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import type { Observable } from 'rxjs';
import { forkJoin, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { globalCacheBusterNotifier } from 'ts-cacheable';
import { ToastSeverity, XeroOnboardingState } from '../models/enum/enum.model';
import type { XeroConnectorService } from '../services/xero/xero-configuration/xero-connector.service';
import type { WorkspaceService } from '../services/common/workspace.service';
import type { IntegrationsToastService } from '../services/common/integrations-toast.service';

@Injectable({
  providedIn: 'root'
})
export class TenantGuard  {

  constructor(
    private xeroConnectorService: XeroConnectorService,
    private router: Router,
    private workspaceService: WorkspaceService,
    private toastService: IntegrationsToastService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const workspaceId = this.workspaceService.getWorkspaceId();

      if (!workspaceId) {
        return this.router.navigateByUrl(`workspaces`);
      }

      return forkJoin(
        [
          this.xeroConnectorService.getTenantMappings()
        ]
      ).pipe(
        map(response => !!response),
        catchError(error => {

          if (error.status === 404) {
            globalCacheBusterNotifier.next();
            this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Oops! You will need to select a tenant to proceed with the onboarding.');
            return this.router.navigateByUrl('/integrations/xero/onboarding/landing');
          }
          return throwError(error);
        })
      );
  }

}
