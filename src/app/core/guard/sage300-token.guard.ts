import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, catchError, throwError } from "rxjs";
import { globalCacheBusterNotifier } from "ts-cacheable";
import { WorkspaceService } from "../services/common/workspace.service";
import { AppUrl } from "../models/enum/enum.model";
import { HelperService } from "../services/common/helper.service";
import { Sage300ConnectorService } from "../services/sage300/sage300-configuration/sage300-connector.service";


@Injectable({
  providedIn: 'root'
})
export class Sage300TokenGuard  {

  constructor(
    private sage300ConnectorService: Sage300ConnectorService,
    private router: Router,
    private workspaceService: WorkspaceService,
    private helperService: HelperService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.helperService.setBaseApiURL(AppUrl.SAGE300);
      const workspaceId = this.workspaceService.getWorkspaceId();

      if (!workspaceId) {
        return this.router.navigateByUrl(`workspaces`);
      }

      return this.sage300ConnectorService.checkSage300TokenHealth(workspaceId).pipe(
        map(() => true),
        catchError(error => {
          if (error.status === 400) {
            globalCacheBusterNotifier.next();

            // Treat fallback as token expired
            return this.router.navigateByUrl('integrations/sage300/token_expired/dashboard');
          }
          return throwError(error);
        })
      );
  }

}