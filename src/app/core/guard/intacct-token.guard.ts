import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, catchError, throwError, of } from "rxjs";
import { globalCacheBusterNotifier } from "ts-cacheable";
import { WorkspaceService } from "../services/common/workspace.service";
import { AppUrl } from "../models/enum/enum.model";
import { HelperService } from "../services/common/helper.service";
import { IntacctConnectorService } from "../services/si/si-core/intacct-connector.service";


@Injectable({
  providedIn: 'root'
})
export class IntacctTokenGuard  {

  constructor(
    private intacctConnectorService: IntacctConnectorService,
    private router: Router,
    private workspaceService: WorkspaceService,
    private helperService: HelperService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.helperService.setBaseApiURL(AppUrl.INTACCT);
      const workspaceId = this.workspaceService.getWorkspaceId();

      if (!workspaceId) {
        return this.router.navigateByUrl(`workspaces`);
      }

      return this.intacctConnectorService.checkIntacctTokenHealth(workspaceId).pipe(
        map(() => true),
        catchError(error => {
          if (error.status === 400) {
            globalCacheBusterNotifier.next();

            if (error.error.message === "Intacct connection expired"){
              return this.router.navigateByUrl('integrations/intacct/token_expired/dashboard');
            }
            // Treat fallback as token expired
            return this.router.navigateByUrl('integrations/intacct/token_expired/dashboard');
          }
          return of(true);
        })
      );
  }

}