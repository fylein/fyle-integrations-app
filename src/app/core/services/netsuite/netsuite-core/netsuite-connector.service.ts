import { Injectable } from '@angular/core';
import { CacheBuster, Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';
import { ApiService } from '../../common/api.service';
import { StorageService } from '../../common/storage.service';
import { SubsidiaryMapping } from 'src/app/core/models/netsuite/db/subsidiary-mapping.model';
import { catchError, map, Observable, of, Subject, switchMap } from 'rxjs';
import { NetsuiteConnectorGet, NetsuiteConnectorModel, NetsuiteConnectorPost, NetsuiteSubsidiaryMappingPost } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-connector.model';
import { WorkspaceService } from '../../common/workspace.service';
import { FormGroup } from '@angular/forms';
import { NetsuiteMappingsService } from './netsuite-mappings.service';
import { IntegrationsToastService } from '../../common/integrations-toast.service';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';


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
    private toastService: IntegrationsToastService
  ) { }

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
    const connectorPayload = NetsuiteConnectorModel.constructPayload(connectNetsuiteForm);
    return this.postCredentials(connectorPayload).pipe(
      switchMap((response) => {
        if (!isReconnecting){
          return this.mappingsService.refreshNetsuiteDimensions(['subsidiaries']).pipe(
            map(() => {
              return { netsuiteSetupForm: NetsuiteConnectorModel.mapAPIResponseToFormGroup(response), isNetsuiteConnected: true };
            })
          );
        }
          this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Reconnected to NetSuite successfully.', 6000);
          return of({ netsuiteSetupForm: NetsuiteConnectorModel.mapAPIResponseToFormGroup(response), isNetsuiteConnected: true });

      }),
      catchError(() => {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error while connecting, please try again later.');
        return of({ netsuiteSetupForm: NetsuiteConnectorModel.mapAPIResponseToFormGroup(this.netsuiteCredential), isNetsuiteConnected: false });
      })
    );
  }

  getNetsuiteFormGroup(): Observable<{netsuiteSetupForm: FormGroup}> {

    return this.getNetsuiteCredentials().pipe(
      map((netsuiteCredential) => {
        this.netsuiteCredential = netsuiteCredential;
        return { netsuiteSetupForm: NetsuiteConnectorModel.mapAPIResponseToFormGroup(netsuiteCredential) };
      }),
      catchError(() => {
        this.netsuiteCredential = null;
        return of({
        netsuiteSetupForm: NetsuiteConnectorModel.mapAPIResponseToFormGroup(null) });
      })
    );
  }

  postSubsdiaryMapping(subsdiaryMappingPayload: NetsuiteSubsidiaryMappingPost): Observable<SubsidiaryMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/mappings/subsidiaries/`, subsdiaryMappingPayload);
  }

  getNetsuiteTokenHealthStatus(): Observable<boolean> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.checkNetsuiteTokenHealth(workspaceId).pipe(
      map(() => {
        return true;
      }),
      catchError(() => {
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
