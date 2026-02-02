import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, finalize, forkJoin, map, of, from } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { BusinessCentralConnectorService } from '../services/business-central/business-central-configuration/business-central-connector.service';
import { IntegrationsToastService } from '../services/common/integrations-toast.service';
import { WorkspaceService } from '../services/common/workspace.service';
import { globalCacheBusterNotifier } from 'ts-cacheable';
import { AppUrl, BusinessCentralOnboardingState, ToastSeverity } from '../models/enum/enum.model';
import { HelperService } from '../services/common/helper.service';
import { LoadingService } from '../services/common/loading.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralTokenGuard  {

  constructor(
    private businessCentralConnectorService: BusinessCentralConnectorService,
    private helperService: HelperService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private loadingService: LoadingService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.helperService.setBaseApiURL(AppUrl.BUSINESS_CENTRAL);
      const workspaceId = this.workspaceService.getWorkspaceId();

      if (!workspaceId) {
        return from(this.router.navigateByUrl('integrations/business_central/'));
      }
      this.loadingService.show();
      return forkJoin(
        [
          this.businessCentralConnectorService.getBusinessCentralCredentials(),
          this.businessCentralConnectorService.getBusinessCentralConnection()
        ]
      ).pipe(
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
    // Handle 400 errors (bad request - typically token issues)
    if (error.status === 400) {
      globalCacheBusterNotifier.next();
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Oops! Your Dynamics 365 Business Central connection expired, please connect again');

      const onboardingState: BusinessCentralOnboardingState = this.workspaceService.getOnboardingState();

      if (onboardingState !== BusinessCentralOnboardingState.COMPLETE) {
        return from(this.router.navigateByUrl('integrations/business_central/onboarding/connector'));
      }

      return from(this.router.navigateByUrl('integrations/business_central/onboarding/landing'));
    }

    // Handle other errors (network, server errors, etc.)
    // Log unexpected errors for debugging
    if (error.status !== 0) { // 0 typically means network error
      console.error('Unexpected error in BusinessCentralTokenGuard:', error);
    }

    // For non-400 errors, allow navigation but connection check failed
    // The component can handle displaying appropriate error messages
    return of(true);
  }

}
