import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, catchError, throwError } from "rxjs";
import { globalCacheBusterNotifier } from "ts-cacheable";
import { WorkspaceService } from "../services/common/workspace.service";
import { AppUrl } from "../models/enum/enum.model";
import { HelperService } from "../services/common/helper.service";
import { NetsuiteConnectorService } from "../services/netsuite/netsuite-core/netsuite-connector.service";


@Injectable({
  providedIn: 'root'
})
export class NetsuiteTokenGuard  {

  constructor(
    private netsuiteConnectorService: NetsuiteConnectorService,
    private router: Router,
    private workspaceService: WorkspaceService,
    private helperService: HelperService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.helperService.setBaseApiURL(AppUrl.NETSUITE);
      const workspaceId = this.workspaceService.getWorkspaceId();

      if (!workspaceId) {
        return this.router.navigateByUrl(`workspaces`);
      }

      return this.netsuiteConnectorService.checkNetsuiteTokenHealth(workspaceId).pipe(
        map(() => true),
        catchError(error => {
          if (error.status === 400) {
          globalCacheBusterNotifier.next();

          if (error.error.message === "Netsuite connection expired"){
            return this.router.navigateByUrl('integrations/netsuite/token_expired/dashboard');
          }

          }
          return throwError(error);
        })
      );
  }

}