import { Injectable } from '@angular/core';
import { HelperService } from '../../common/helper.service';
import { Observable, Subject, catchError, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../common/api.service';
import { StorageService } from '../../common/storage.service';
import { CacheBuster, Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';
import { Sage300Credential } from 'src/app/core/models/sage300/db/sage300-credentials.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Sage300ConnectorModel } from 'src/app/core/models/sage300/sage300-configuration/sage300-connector.model';
import { Sage300MappingService } from '../sage300-core/sage300-mapping.service';
import { IntegrationsToastService } from '../../common/integrations-toast.service';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { WorkspaceService } from '../../common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';

const sage300CredentialCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})

export class Sage300ConnectorService {

  workspaceId: number;

  sage300Credential: Sage300Credential | null = null;

  doesSage300CredentialsExist: boolean;

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    helper: HelperService,
    private mappingsService: Sage300MappingService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService
  ) {
    helper.setBaseApiURL();
  }

  mapAPIResponseToConnectorFormGroup(sage300Connection: Sage300Credential | null): FormGroup {
    const isDisabled = sage300Connection?.identifier ? true : false;
    return new FormGroup({
      companyID: new FormControl({value: sage300Connection?.identifier ? sage300Connection?.identifier : null, disabled: isDisabled}, Validators.required),
      userID: new FormControl('', Validators.required),
      userPassword: new FormControl('', Validators.required)
    });
  }

  @Cacheable({
    cacheBusterObserver: sage300CredentialCache
  })
  getSage300Credential(): Observable<Sage300Credential> {
    return this.apiService.get(`/workspaces/${this.storageService.get('workspaceId')}/credentials/sage300/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: sage300CredentialCache
  })
  upsertCredentials(data: Sage300Credential): Observable<Sage300Credential> {
    globalCacheBusterNotifier.next();
    if (this.doesSage300CredentialsExist){
      return this.apiService.patch(`/workspaces/${this.storageService.get('workspaceId')}/credentials/sage300/`, data);
    }
    return this.apiService.post(`/workspaces/${this.storageService.get('workspaceId')}/credentials/sage300/`, data);
  }

  @Cacheable()
  checkSage300TokenHealth(workspaceId: string): Observable<{}> {
    return this.apiService.get(`/workspaces/${workspaceId}/token_health/`, {});
  }

  getSage300TokenHealthStatus(shouldShowTokenExpiredMessage?: boolean): Observable<boolean> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.checkSage300TokenHealth(workspaceId).pipe(
      map(() => {
        return true;
      }),
      catchError((error) => {
        if (error.error.message !== "Sage300 credentials not found" && shouldShowTokenExpiredMessage) {
          this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('services.sage300Connector.connectionExpiredToast'), 6000);
        }
        return of(false);
      })
    );
  }

  getSage300FormGroup(): Observable<FormGroup> {
    return this.getSage300Credential().pipe(
      map((sage300Credential: Sage300Credential) => {
        this.sage300Credential = sage300Credential;
        this.doesSage300CredentialsExist = true;
        return this.mapAPIResponseToConnectorFormGroup(sage300Credential);
      }),
      catchError(() => {
        this.doesSage300CredentialsExist = false;
        return of(this.mapAPIResponseToConnectorFormGroup(null));
      })
    );
  }

  connectSage300(sage300SetupForm: FormGroup, isReconnecting?: boolean): Observable<Sage300ConnectorModel> {
    const sage300Credential: Sage300Credential = {
      username: sage300SetupForm.get('userID')?.value,
      identifier: sage300SetupForm.get('companyID')?.value,
      password: sage300SetupForm.get('userPassword')?.value,
      workspace: this.storageService.get('workspaceId')
    };

    return this.upsertCredentials(sage300Credential).pipe(
      switchMap(() => {
        if (!isReconnecting) {
          return this.mappingsService.importSage300Attributes(true).pipe(
            map(() => {
              return {
                sage300SetupForm: this.mapAPIResponseToConnectorFormGroup(sage300Credential),
                isSage300Connected: true
              };
            })
          );
        }
          this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('services.sage300Connector.connectionReconnectedToast'), 6000);
          return of({ sage300SetupForm: this.mapAPIResponseToConnectorFormGroup(sage300Credential), isSage300Connected: true });
      }),
      catchError(() => {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('services.sage300Connector.connectionErrorToast'), 6000);
        return of({sage300SetupForm: sage300SetupForm, isSage300Connected: false});
      })
    );
  }

}
