import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, finalize, from } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkspaceService } from '../services/common/workspace.service';
import { TravelperkService } from '../services/travelperk/travelperk-core/travelperk.service';
import { globalCacheBusterNotifier } from 'ts-cacheable';
import { IntegrationsToastService } from '../services/common/integrations-toast.service';
import { TravelPerkOnboardingState, ToastSeverity } from '../models/enum/enum.model';
import { LoadingService } from '../services/common/loading.service';

@Injectable({
  providedIn: 'root'
})
export class TravelperkTokenGuard {
  constructor(
    private travelperkService: TravelperkService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private loadingService: LoadingService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!workspaceId) {
      return from(this.router.navigateByUrl('workspaces'));
    }

    this.loadingService.show();
    return this.travelperkService.getTravelperkTokenHealth().pipe(
      map(() => true),
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
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Oops! Your Perk connection expired, please connect again');
      return from(this.router.navigateByUrl('integrations/travelperk/onboarding/landing'));
    }

    // Handle other errors (network, server errors, etc.)
    // Log unexpected errors for debugging
    if (error.status !== 0) { // 0 typically means network error
      console.error('Unexpected error in TravelperkTokenGuard:', error);
    }

    // For non-400 errors, allow navigation but connection check failed
    // The component can handle displaying appropriate error messages
    return of(true);
  }
}