import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, forkJoin, map, throwError } from 'rxjs';
import { BusinessCentralConnectorService } from '../services/business-central/business-central-configuration/business-central-connector.service';
import { IntegrationsToastService } from '../services/common/integrations-toast.service';
import { WorkspaceService } from '../services/common/workspace.service';
import { globalCacheBusterNotifier } from 'ts-cacheable';
import { AppUrl, BusinessCentralOnboardingState, ToastSeverity } from '../models/enum/enum.model';
import { HelperService } from '../services/common/helper.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessCentralTokenGuard {
  constructor(
    private businessCentralConnectorService: BusinessCentralConnectorService,
    private helperService: HelperService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.helperService.setBaseApiURL(AppUrl.BUSINESS_CENTRAL);
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!workspaceId) {
      return this.router.navigateByUrl(`integrations/business_central/`);
    }

    return forkJoin([
      this.businessCentralConnectorService.getBusinessCentralCredentials(),
      this.businessCentralConnectorService.getBusinessCentralConnection(),
    ]).pipe(
      map((response) => !!response),
      catchError((error) => {
        if (error.status === 400) {
          globalCacheBusterNotifier.next();
          this.toastService.displayToastMessage(
            ToastSeverity.ERROR,
            'Oops! Your Dynamics 365 Business Central connection expired, please connect again',
          );

          const onboardingState: BusinessCentralOnboardingState = this.workspaceService.getOnboardingState();

          if (onboardingState !== BusinessCentralOnboardingState.COMPLETE) {
            return this.router.navigateByUrl('integrations/business_central/onboarding/connector');
          }

          return this.router.navigateByUrl('integrations/business_central/onboarding/landing');
        }

        return throwError(error);
      }),
    );
  }
}
