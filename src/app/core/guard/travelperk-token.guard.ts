import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { WorkspaceService } from '../services/common/workspace.service';
import { TravelperkService } from '../services/travelperk/travelperk-core/travelperk.service';
import { globalCacheBusterNotifier } from 'ts-cacheable';
import { IntegrationsToastService } from '../services/common/integrations-toast.service';
import { TravelPerkOnboardingState, ToastSeverity } from '../models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class TravelperkTokenGuard {
  constructor(
    private travelperkService: TravelperkService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.travelperkService.getTravelperkTokenHealth().pipe(
      map(() => true),
      catchError(error => {
        if (error.status === 400) {
          globalCacheBusterNotifier.next();
          this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Oops! Your TravelPerk connection expired, please connect again');
          this.router.navigateByUrl('integrations/travelperk/onboarding/landing');
        }
        return throwError(() => error);
      })
    );
  }
}