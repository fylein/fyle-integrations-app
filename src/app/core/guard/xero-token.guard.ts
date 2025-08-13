import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { XeroConnectorService } from "../services/xero/xero-configuration/xero-connector.service";
import { Observable, map, catchError, throwError } from "rxjs";
import { globalCacheBusterNotifier } from "ts-cacheable";
import { WorkspaceService } from "../services/common/workspace.service";
import { AppUrl, ToastSeverity, XeroOnboardingState } from "../models/enum/enum.model";
import { IntegrationsToastService } from "../services/common/integrations-toast.service";
import { HelperService } from "../services/common/helper.service";


@Injectable({
  providedIn: 'root'
})
export class XeroTokenGuard  {

  constructor(
    private xeroConnectorService: XeroConnectorService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private helperService: HelperService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.helperService.setBaseApiURL(AppUrl.XERO);
      const workspaceId = this.workspaceService.getWorkspaceId();

      if (!workspaceId) {
        return this.router.navigateByUrl(`workspaces`);
      }

      return this.xeroConnectorService.checkXeroTokenHealth(workspaceId).pipe(
        map(() => true),
        catchError(error => {
          if (error.status === 400) {
            globalCacheBusterNotifier.next();

            const onboardingState: XeroOnboardingState = this.workspaceService.getOnboardingState();
            if (onboardingState !== XeroOnboardingState.COMPLETE) {
              this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Oops! your xero connection expired, please connect again');
              return this.router.navigateByUrl('integrations/xero/onboarding/connector');
            }

            if (error.error.message === "Xero disconnected"){
              return this.router.navigateByUrl('integrations/xero/disconnect/dashboard');
            }

            // Treat fallback as token expired
            return this.router.navigateByUrl('integrations/xero/token_expired/dashboard');
          }

          return throwError(error);
        })
      );
  }

}