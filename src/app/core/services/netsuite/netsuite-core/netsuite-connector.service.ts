import { Injectable } from '@angular/core';
import { CacheBuster, Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';
import { ApiService } from '../../common/api.service';
import { StorageService } from '../../common/storage.service';
import { SubsidiaryMapping } from 'src/app/core/models/netsuite/db/subsidiary-mapping.model';
import { catchError, map, Observable, of, Subject, switchMap } from 'rxjs';
import { NetsuiteConnectorGet, NetsuiteConnectorPost, NetsuiteSubsidiaryMappingPost } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-connector.model';
import { WorkspaceService } from '../../common/workspace.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NetsuiteMappingsService } from './netsuite-mappings.service';
import { IntegrationsToastService } from '../../common/integrations-toast.service';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { TranslocoService } from '@jsverse/transloco';


const netsuiteCredentialCache = new Subject<void>();


@Injectable({
  providedIn: 'root'
})
export class NetsuiteConnectorService {

  workspaceId: number;

  netsuiteCredential: NetsuiteConnectorGet | null = null;

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private storageService: StorageService,
    private mappingsService: NetsuiteMappingsService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService
  ) { }

  mapAPIResponseToNetSuiteConnectorFormGroup(netsuiiteConnection: NetsuiteConnectorGet | null): FormGroup {
    const isDisabled = netsuiiteConnection?.ns_account_id ? true : false;
    return new FormGroup({
      accountId: new FormControl({value: netsuiiteConnection?.ns_account_id ? netsuiiteConnection?.ns_account_id : null, disabled: isDisabled}, Validators.required),
      tokenId: new FormControl(null, Validators.required),
      tokenSecret: new FormControl(null, Validators.required)
    });
  }

  constructNetSuiteConnectorPayload(form: FormGroup): NetsuiteConnectorPost {
    return {
      ns_account_id: form.controls.accountId.value,
      ns_token_id: form.controls.tokenId.value,
      ns_token_secret: form.controls.tokenSecret.value
    };
  }

  @Cacheable({
    cacheBusterObserver: netsuiteCredentialCache
  })
  getNetsuiteCredentials(): Observable<NetsuiteConnectorGet> {
    this.workspaceId = this.storageService.get('workspaceId');
    return this.apiService.get(`/workspaces/${this.workspaceId}/credentials/netsuite/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: netsuiteCredentialCache
  })
  private postCredentials(data: NetsuiteConnectorPost): Observable<NetsuiteConnectorGet> {
    this.workspaceId = this.storageService.get('workspaceId');
    globalCacheBusterNotifier.next();
    return this.apiService.post(`/workspaces/${this.workspaceId}/credentials/netsuite/`, data);
  }

  connectNetsuite(connectNetsuiteForm: FormGroup, isReconnecting?: boolean): Observable<{netsuiteSetupForm: FormGroup, isNetsuiteConnected: boolean}>{
    this.workspaceId = this.storageService.get('workspaceId');
    const connectorPayload = this.constructNetSuiteConnectorPayload(connectNetsuiteForm);
    return this.postCredentials(connectorPayload).pipe(
      switchMap((response) => {
        if (!isReconnecting){
          return this.mappingsService.refreshNetsuiteDimensions(['subsidiaries']).pipe(
            map(() => {
              return { netsuiteSetupForm: this.mapAPIResponseToNetSuiteConnectorFormGroup(response), isNetsuiteConnected: true };
            })
          );
        }
          this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('netsuiteConnector.connectionReconnectedToast'), 6000);
          return of({ netsuiteSetupForm: this.mapAPIResponseToNetSuiteConnectorFormGroup(response), isNetsuiteConnected: true });

      }),
      catchError(() => {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('netsuiteConnector.connectionErrorToast'));
        return of({ netsuiteSetupForm: this.mapAPIResponseToNetSuiteConnectorFormGroup(this.netsuiteCredential), isNetsuiteConnected: false });
      })
    );
  }

  getNetsuiteFormGroup(): Observable<{netsuiteSetupForm: FormGroup}> {

    return this.getNetsuiteCredentials().pipe(
      map((netsuiteCredential) => {
        this.netsuiteCredential = netsuiteCredential;
        return { netsuiteSetupForm: this.mapAPIResponseToNetSuiteConnectorFormGroup(netsuiteCredential) };
      }),
      catchError(() => {
        this.netsuiteCredential = null;
        return of({
        netsuiteSetupForm: this.mapAPIResponseToNetSuiteConnectorFormGroup(null) });
      })
    );
}

  postSubsdiaryMapping(subsdiaryMappingPayload: NetsuiteSubsidiaryMappingPost): Observable<SubsidiaryMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/mappings/subsidiaries/`, subsdiaryMappingPayload);
  }

  getNetsuiteTokenHealthStatus(shouldShowTokenExpiredMessage?: boolean): Observable<boolean> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.checkNetsuiteTokenHealth(workspaceId).pipe(
      map(() => {
        return true;
      }),
      catchError((error) => {
        if (error.error.message !== "Netsuite credentials not found" && shouldShowTokenExpiredMessage){
          this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('netsuiteConnector.connectionExpiredToast'), 6000);
        }
        return of(false);
      })
    );
  }

  @Cacheable()
  checkNetsuiteTokenHealth(workspaceId: string): Observable<{}> {
    return this.apiService.get(`/workspaces/${workspaceId}/token_health/`, {});
  }

  getSubsidiaryMapping(): Observable<SubsidiaryMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/mappings/subsidiaries/`, {});
  }
}
