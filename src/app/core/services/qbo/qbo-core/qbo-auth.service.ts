import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../../common/api.service';
import { Token } from 'src/app/core/models/misc/token.model';
import { HelperService } from '../../common/helper.service';
import { AppUrl, QBOOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { environment } from 'src/environments/environment';
import { NavigationExtras, Router } from '@angular/router';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QBOConnectorModel, QBOConnectorPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-connector.model';
import { QBOCredential } from 'src/app/core/models/qbo/db/qbo-credential.model';
import { QboConnectorService } from 'src/app/core/services/qbo/qbo-configuration/qbo-connector.service';
import { IntegrationsToastService } from '../../common/integrations-toast.service';

@Injectable({
  providedIn: 'root'
})
export class QboAuthService {

  private qboConnectionInProgressSubject = new BehaviorSubject<boolean>(false);

  qboConnectionInProgress$ = this.qboConnectionInProgressSubject.asObservable();

  private isIncorrectQBOConnectedDialogVisibleSubject = new BehaviorSubject<boolean>(false);

  isIncorrectAccountSelected$ = this.isIncorrectQBOConnectedDialogVisibleSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private helperService: HelperService,
    private router: Router,
    private workspaceService: WorkspaceService,
    private qboConnectorService: QboConnectorService,
    private toastService: IntegrationsToastService
  ) {}

  loginWithRefreshToken(refresh_token: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token });
  }

  loginWithAuthCode(code: string): Observable<Token> {
    this.helperService.setBaseApiURL(AppUrl.QBO);
    return this.apiService.post('/auth/login/', { code });
  }

  connectQbo(): void {
    this.qboConnectionInProgressSubject.next(true);
    const url = `${environment.qbo_authorize_uri}?client_id=${environment.qbo_oauth_client_id}&scope=com.intuit.quickbooks.accounting&response_type=code&redirect_uri=${environment.qbo_oauth_redirect_uri}&state=qbo_local_redirect`;

    this.helperService.oauthCallbackUrl.subscribe((callbackURL: string) => {
      const code = callbackURL.split('code=')[1].split('&')[0];
      const realmId = callbackURL.split('realmId=')[1].split('&')[0];
      this.checkProgressAndRedirect(code, realmId);
    });

    this.helperService.oauthHandler(url);
  }

  private postQboCredentials(code: string, realmId: string): void {
    const payload: QBOConnectorPost = QBOConnectorModel.constructPayload(code, realmId);

    this.qboConnectorService.connectQBO(payload).subscribe((qboCredential: QBOCredential) => {
      this.qboConnectionInProgressSubject.next(false);
      this.router.navigate([`/integrations/qbo/main/dashboard`]);
    }, (error) => {
      this.qboConnectionInProgressSubject.next(false);
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to QuickBooks Online. Please try again';
      if (errorMessage === 'Please choose the correct QuickBooks Online account') {
        this.isIncorrectQBOConnectedDialogVisibleSubject.next(true);
      } else {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong, please try again.');
        if (this.router.url.includes("/token_expired/")){
        this.router.navigate([`/integrations/qbo/token_expired/dashboard`]);
        } else {
        this.router.navigate([`/integrations/qbo/onboarding/landing`]);
        }
      }
    });
  }

  private checkProgressAndRedirect(code: string, realmId: string): void {
    const onboardingState: QBOOnboardingState = this.workspaceService.getOnboardingState();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        code,
        realmId
      }
    };

    if (onboardingState !== QBOOnboardingState.COMPLETE) {
      this.qboConnectionInProgressSubject.next(false);
      this.router.navigate(['integrations/qbo/onboarding/connector'], navigationExtras);
    } else {
      this.postQboCredentials(code, realmId);
    }
  }
}
