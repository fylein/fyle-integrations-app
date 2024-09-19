import { Inject, Injectable } from "@angular/core";
import type { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import type { XeroConnectorService } from "../services/xero/xero-configuration/xero-connector.service";
import type { Observable } from "rxjs";
import { forkJoin, map, catchError, throwError } from "rxjs";
import { globalCacheBusterNotifier } from "ts-cacheable";
import type { WorkspaceService } from "../services/common/workspace.service";
import { AppUrl, ToastSeverity, XeroOnboardingState } from "../models/enum/enum.model";
import type { IntegrationsToastService } from "../services/common/integrations-toast.service";
import type { HelperService } from "../services/common/helper.service";


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

      return forkJoin(
        [
          this.xeroConnectorService.getXeroCredentials(workspaceId),
          this.xeroConnectorService.getXeroTokenHealth(workspaceId)
        ]
      ).pipe(
        map(response => !!response),
        catchError(error => {
          if (error.status === 400) {
            globalCacheBusterNotifier.next();
            this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Oops! Your Xero connection expired, please connect again');

            return this.router.navigateByUrl('integrations/xero/onboarding/landing');
          }

          return throwError(error);
        })
      );
  }

}
