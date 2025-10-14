import { Injectable } from '@angular/core';
import { HelperService } from '../../common/helper.service';
import { Observable, Subject, catchError, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../common/api.service';
import { StorageService } from '../../common/storage.service';
import { CacheBuster, Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IntegrationsToastService } from '../../common/integrations-toast.service';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { WorkspaceService } from '../../common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';

const sage50CredentialCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class Sage50ConnectorService {

  workspaceId: number;

  sage50Credential: any | null = null;

  doesSage50CredentialsExist: boolean;

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    helper: HelperService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService
  ) {
    helper.setBaseApiURL();
  }

  mapAPIResponseToConnectorFormGroup(sage50Connection: any | null): FormGroup {
    const isDisabled = sage50Connection?.identifier ? true : false;
    return new FormGroup({
      companyID: new FormControl({value: sage50Connection?.identifier ? sage50Connection?.identifier : null, disabled: isDisabled}, Validators.required),
      userID: new FormControl('', Validators.required),
      userPassword: new FormControl('', Validators.required)
    });
  }

  @Cacheable({
    cacheBusterObserver: sage50CredentialCache
  })
  getSage50Credential(): Observable<any> {
    return this.apiService.get(`/workspaces/${this.storageService.get('workspaceId')}/credentials/sage50/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: sage50CredentialCache
  })
  upsertCredentials(data: any): Observable<any> {
    globalCacheBusterNotifier.next();
    if (this.doesSage50CredentialsExist) {
      return this.apiService.patch(`/workspaces/${this.storageService.get('workspaceId')}/credentials/sage50/`, data);
    }
    return this.apiService.post(`/workspaces/${this.storageService.get('workspaceId')}/credentials/sage50/`, data);
  }

  @Cacheable()
  checkSage50TokenHealth(workspaceId: string): Observable<{}> {
    return this.apiService.get(`/workspaces/${workspaceId}/token_health/`, {});
  }

  getSage50TokenHealthStatus(shouldShowTokenExpiredMessage?: boolean): Observable<boolean> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.checkSage50TokenHealth(workspaceId).pipe(
      map(() => {
        return true;
      }),
      catchError((error) => {
        if (error.error.message !== "Sage50 credentials not found" && shouldShowTokenExpiredMessage) {
          this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('services.sage50Connector.connectionExpiredToast'), 6000);
        }
        return of(false);
      })
    );
  }

  getSage50FormGroup(): Observable<FormGroup> {
    return this.getSage50Credential().pipe(
      map((sage50Credential: any) => {
        this.sage50Credential = sage50Credential;
        this.doesSage50CredentialsExist = true;
        return this.mapAPIResponseToConnectorFormGroup(sage50Credential);
      }),
      catchError(() => {
        this.doesSage50CredentialsExist = false;
        return of(this.mapAPIResponseToConnectorFormGroup(null));
      })
    );
  }

  connectSage50(sage50SetupForm: FormGroup, isReconnecting?: boolean): Observable<any> {
    const sage50Credential: any = {
      username: sage50SetupForm.get('userID')?.value,
      identifier: sage50SetupForm.get('companyID')?.value,
      password: sage50SetupForm.get('userPassword')?.value,
      workspace: this.storageService.get('workspaceId')
    };

    return this.upsertCredentials(sage50Credential).pipe(
      switchMap(() => {
        if (!isReconnecting) {
          return of({
            sage50SetupForm: this.mapAPIResponseToConnectorFormGroup(sage50Credential),
            isSage50Connected: true
          });
        }
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('services.sage50Connector.connectionReconnectedToast'), 6000);
        return of({ sage50SetupForm: this.mapAPIResponseToConnectorFormGroup(sage50Credential), isSage50Connected: true });
      }),
      catchError(() => {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('services.sage50Connector.connectionErrorToast'), 6000);
        return of({sage50SetupForm: sage50SetupForm, isSage50Connected: false});
      })
    );
  }

}

