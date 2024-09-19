import { Inject, Injectable } from '@angular/core';
import type { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import type { Observable } from 'rxjs';
import { catchError, forkJoin, map, throwError } from 'rxjs';
import type { WorkspaceService } from '../services/common/workspace.service';
import type { QboConnectorService } from '../services/qbo/qbo-configuration/qbo-connector.service';
import { globalCacheBusterNotifier } from 'ts-cacheable';
import type { IntegrationsToastService } from '../services/common/integrations-toast.service';
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

      return forkJoin(
        [
          this.qboConnectorService.getQBOCredentials(),
          this.qboConnectorService.getPreferences()
        ]
      ).pipe(
        map(response => !!response),
        catchError(error => {
          if (error.status === 400) {
            globalCacheBusterNotifier.next();
            this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Oops! Your QuickBooks Online connection expired, please connect again');

            const onboardingState: QBOOnboardingState = this.workspaceService.getOnboardingState();

            if (onboardingState !== QBOOnboardingState.COMPLETE) {
              return this.router.navigateByUrl('integrations/qbo/onboarding/connector');
            }

            return this.router.navigateByUrl('integrations/qbo/onboarding/landing');
          }

          return throwError(error);
        })
      );
  }

}
