import { Injectable, OnDestroy } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { Token } from 'src/app/core/models/misc/token.model';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HelperService } from '../../common/helper.service';
import { AppUrl, ToastSeverity, XeroOnboardingState } from 'src/app/core/models/enum/enum.model';
import { WorkspaceService } from '../../common/workspace.service';
import { XeroConnectorService } from '../xero-configuration/xero-connector.service';
import { IntegrationsToastService } from '../../common/integrations-toast.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { XeroCredentials } from 'src/app/core/models/xero/db/xero-credential.model';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class XeroAuthService implements OnDestroy {

  private xeroConnectionInProgressSubject = new BehaviorSubject<boolean>(false);

  xeroConnectionInProgress$ = this.xeroConnectionInProgressSubject.asObservable();

  private isIntegrationConnectedSubject = new BehaviorSubject<boolean>(false);

  isIntegrationConnected$ = this.isIntegrationConnectedSubject.asObservable();

  private isIncorrectXeroConnectedDialogVisibleSubject = new BehaviorSubject<boolean>(false);

  isIncorrectAccountSelected$ = this.isIncorrectXeroConnectedDialogVisibleSubject.asObservable();

  private oauthCallbackSubscription: Subscription;

  constructor(
    private apiService: ApiService,
    private helperService: HelperService,
    private workspaceService: WorkspaceService,
    private xeroConnectorService: XeroConnectorService,
    private toastService: IntegrationsToastService,
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  loginWithRefreshToken(refreshToken: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token: refreshToken });
  }

  login(code: string): Observable<Token> {
    this.helperService.setBaseApiURL(AppUrl.XERO);
    return this.apiService.post('/auth/login/', { code: code });
  }

  private postXeroCredentials(code: string): void {
    this.xeroConnectorService.connectXero(this.workspaceService.getWorkspaceId(), code).subscribe((xeroCredentials: XeroCredentials) => {
      this.isIntegrationConnectedSubject.next(true);
      this.xeroConnectionInProgressSubject.next(false);
      this.checkProgressAndRedirect();
    }, (error) => {
      const errorMessage = 'message' in error.error ? error.error.message : this.translocoService.translate('services.xeroAuth.failedToConnectTenant');
      if (errorMessage === this.translocoService.translate('services.xeroAuth.chooseCorrectAccount')) {
        this.isIntegrationConnectedSubject.next(false);
        this.xeroConnectionInProgressSubject.next(false);
        this.isIncorrectXeroConnectedDialogVisibleSubject.next(true);
      } else {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, errorMessage);
        if (this.router.url.includes("/token_expired/")){
        this.router.navigate([`/integrations/xero/token_expired/dashboard`]);
        } else {
        this.router.navigate([`/integrations/xero/onboarding/landing`]);
        }
      }
    });
  }

  private checkProgressAndRedirect(): void {
    const onboardingState: XeroOnboardingState = this.workspaceService.getOnboardingState();
    if (onboardingState !== XeroOnboardingState.COMPLETE) {
      this.xeroConnectorService.postXeroTenants().subscribe(() => {
        this.workspaceService.setOnboardingState(XeroOnboardingState.TENANT_MAPPING);
        this.router.navigate(['integrations/xero/onboarding/connector']);
      });
    } else {
      this.router.navigate(['integrations/xero/main/dashboard']);
    }
  }

  connectXero() {
    if (this.oauthCallbackSubscription) {
      this.oauthCallbackSubscription.unsubscribe();
    }

    this.xeroConnectionInProgressSubject.next(true);
    const url = `${environment.xero_authorize_uri}?client_id=${environment.xero_oauth_client_id}&scope=${environment.xero_scope}&response_type=code&redirect_uri=${environment.xero_oauth_redirect_uri}&state=xero_local_redirect`;
    this.oauthCallbackSubscription = this.helperService.oauthCallbackUrl.subscribe((callbackURL: string) => {
      const code = callbackURL.split('code=')[1]?.split('&')[0];
      this.postXeroCredentials(code);
    });
    this.helperService.oauthHandler(url);
  }

  ngOnDestroy(): void {
    if (this.oauthCallbackSubscription) {
      this.oauthCallbackSubscription.unsubscribe();
    }
  }

}
