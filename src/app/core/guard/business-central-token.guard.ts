import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, forkJoin, map, throwError } from 'rxjs';
import { BusinessCentralConnectorService } from '../services/business-central/business-central-configuration/business-central-connector.service';
import { IntegrationsToastService } from '../services/common/integrations-toast.service';
import { WorkspaceService } from '../services/common/workspace.service';
import { globalCacheBusterNotifier } from 'ts-cacheable';
import { BusinessCentralOnboardingState, ToastSeverity } from '../models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralTokenGuard implements CanActivate {

  constructor(
    private businessCentralConnectorService: BusinessCentralConnectorService,
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
          this.businessCentralConnectorService.getBusinessCentralCredentials()
        ]
      ).pipe(
        map(response => !!response),
        catchError(error => {
          if (error.status === 400) {
            globalCacheBusterNotifier.next();
            this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Oops! Your Dynamic 360 Business Central connection expired, please connect again');

            const onboardingState: BusinessCentralOnboardingState = this.workspaceService.getOnboardingState();

            if (onboardingState !==  BusinessCentralOnboardingState.COMPLETE) {
              return this.router.navigateByUrl('integrations/business_central/onboarding/connector');
            }

            return this.router.navigateByUrl('integrations/business_central/onboarding/landing');
          }

          return throwError(error);
        })
      );
  }

}
