import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, forkJoin, map, switchMap, throwError } from 'rxjs';
import { WorkspaceService } from '../services/common/workspace.service';
import { QboConnectorService } from '../services/qbo/qbo-configuration/qbo-connector.service';
import { globalCacheBusterNotifier } from 'ts-cacheable';
import { IntegrationsToastService } from '../services/common/integrations-toast.service';
import { QBOOnboardingState, ToastSeverity } from '../models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class QboTokenGuard  {

  constructor(
    private qboConnectorService: QboConnectorService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const workspaceId = this.workspaceService.getWorkspaceId();

      if (!workspaceId) {
        return this.router.navigateByUrl(`workspaces`);
      }

      return this.qboConnectorService.checkQBOTokenHealth().pipe(
        map(() => true),
        catchError(error => {
          if (error.status === 400) {
            globalCacheBusterNotifier.next();
      
            const onboardingState: QBOOnboardingState = this.workspaceService.getOnboardingState();
            if (onboardingState !== QBOOnboardingState.COMPLETE) {
              this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Oops! your QuickBooks Online connection expired, please connect again');
              return this.router.navigateByUrl('integrations/qbo/onboarding/connector');
            }
      
            if (error.error.message === "Quickbooks Online connection expired") {
              return this.router.navigateByUrl('integrations/qbo/token_expired/dashboard');
            }
      
            if (error.error.message === "Quickbooks Online disconnected") {
              return this.router.navigateByUrl('integrations/qbo/disconnect/dashboard');
            }
          }
      
          return throwError(error);
        })
      );
      
  }

}