import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, catchError, of, finalize, from } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { globalCacheBusterNotifier } from 'ts-cacheable';
import { ToastSeverity } from '../models/enum/enum.model';
import { XeroConnectorService } from '../services/xero/xero-configuration/xero-connector.service';
import { WorkspaceService } from '../services/common/workspace.service';
import { IntegrationsToastService } from '../services/common/integrations-toast.service';
import { LoadingService } from '../services/common/loading.service';

@Injectable({
  providedIn: 'root'
})
export class TenantGuard  {

  constructor(
    private xeroConnectorService: XeroConnectorService,
    private router: Router,
    private workspaceService: WorkspaceService,
    private toastService: IntegrationsToastService,
    private loadingService: LoadingService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const workspaceId = this.workspaceService.getWorkspaceId();

      if (!workspaceId) {
        return from(this.router.navigateByUrl('workspaces'));
      }

      this.loadingService.show();
      // No need for forkJoin with a single observable - use it directly
      return this.xeroConnectorService.getTenantMappings().pipe(
        map(response => !!response),
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error);
        }),
        finalize(() => {
          this.loadingService.hide();
        })
      );
  }

  private handleError(error: HttpErrorResponse): Observable<boolean | UrlTree> {
    // Handle 404 errors (tenant mappings not found - user needs to select tenant)
    if (error.status === 404) {
      globalCacheBusterNotifier.next();
      this.toastService.displayToastMessage(
        ToastSeverity.ERROR,
        'Oops! You will need to select a tenant to proceed with the onboarding.'
      );
      return from(this.router.navigateByUrl('/integrations/xero/onboarding/landing'));
    }

    // Handle other errors (network, server errors, etc.)
    // Log unexpected errors for debugging
    if (error.status !== 0) { // 0 typically means network error
      console.error('Unexpected error in TenantGuard:', error);
    }

    // For non-404 errors, allow navigation but tenant check failed
    // The component can handle displaying appropriate error messages
    return of(true);
  }

}
