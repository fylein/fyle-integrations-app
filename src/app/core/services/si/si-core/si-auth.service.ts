import { Injectable } from '@angular/core';
import { catchError, concat, concatMap, finalize, forkJoin, ignoreElements, map, Observable, of, tap, toArray } from 'rxjs';
import { Token } from 'src/app/core/models/misc/token.model';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';
import { AppUrl, IntacctOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { environment } from 'src/environments/environment';
import { WorkspaceService } from '../../common/workspace.service';
import { NavigationExtras, Router } from '@angular/router';
import { IntacctConnectorService } from './si-connector.service';
import { SageIntacctCredential } from 'src/app/core/models/intacct/db/sage-credentials.model';
import { IntacctAuthorizationCodePayload } from 'src/app/core/models/intacct/intacct-configuration/connector.model';
import { TranslocoService } from '@jsverse/transloco';
import { SiMappingsService } from './si-mappings.service';
import { IntegrationsToastService } from '../../common/integrations-toast.service';

@Injectable({
  providedIn: 'root'
})
export class SiAuthService {

  private oauthInProgress$: Observable<null> | null = null;

  constructor(
    private apiService: ApiService,
    private helperService: HelperService,
    private workspaceService: WorkspaceService,
    private router: Router,
    private intacctConnectorService: IntacctConnectorService,
    private mappingsService: SiMappingsService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService
  ) {
    this.helperService.setBaseApiURL(AppUrl.INTACCT);
  }

  loginWithRefreshToken(refresh_token: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token });
  }

  loginWithAuthCode(code: string): Observable<Token> {
    this.helperService.setBaseApiURL(AppUrl.INTACCT);
    return this.apiService.post('/auth/login/', { code });
  }

  refreshAccessToken(refreshToken: string): Observable<Token> {
    return this.apiService.post('/auth/refresh/', { refresh_token: refreshToken });
  }

  private checkProgressAndRedirect(code: string): Observable<null> {
    const onboardingState = this.workspaceService.getOnboardingState();
    const isReconnecting = onboardingState === IntacctOnboardingState.COMPLETE;

    const payload: IntacctAuthorizationCodePayload = { code, redirect_uri: environment.intacct_oauth_redirect_uri };
    const intacctConnectionSequence = [
      this.intacctConnectorService.postAuthCode(payload),
      // Refresh location entities only while onboarding
      ...(!isReconnecting ? [this.mappingsService.refreshSageIntacctDimensions(['location_entities'])] : [])
    ];

    return concat(...intacctConnectionSequence).pipe(
      // Waits for all observables in concat sequence to complete
      toArray(),

      tap(() => {
        if (isReconnecting) {
          this.router.navigate(['integrations/intacct/main/dashboard']);
        } else {
          this.router.navigate(['integrations/intacct/onboarding/connector']);
        }
      }),
      map(() => null),

      catchError((error) => {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('services.siAuth.failedToConnect'));
        return of(null);
      })
    );
  }

  connectIntacct(): Observable<null> {
    // If we're already listening for the callback, don't listen again
    if (!this.oauthInProgress$) {
      this.oauthInProgress$ = this.helperService.oauthCallbackUrl.pipe(
        concatMap((callbackURL: string) => {
          const code = callbackURL.split('code=')[1].split('&')[0];
          return this.checkProgressAndRedirect(code);
        })
      );
    }

    const url = `${environment.intacct_authorize_uri}?response_type=code&client_id=${environment.intacct_oauth_client_id}&redirect_uri=${environment.intacct_oauth_redirect_uri}&state=travelperk_local_redirect&scope=offline_access`;
    this.helperService.oauthHandler(url);
    return this.oauthInProgress$;
  }
}
