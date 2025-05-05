import { Injectable } from '@angular/core';
import { CacheBuster, Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';
import { ApiService } from '../../common/api.service';
import { StorageService } from '../../common/storage.service';
import { SubsidiaryMapping } from 'src/app/core/models/netsuite/db/subsidiary-mapping.model';
import { catchError, EMPTY, Observable, Subject, tap } from 'rxjs';
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

  private connectNetsuiteFormSubject = new Subject<FormGroup>();

  connectNetsuiteForm$ = this.connectNetsuiteFormSubject.asObservable();

  private setupConnectionStatusSubject = new Subject<boolean>();

  setupConnectionStatus$ = this.setupConnectionStatusSubject.asObservable();

  private isLoadingSubject = new Subject<boolean>();

  isLoading$ = this.isLoadingSubject.asObservable();

  isNetsuiteCredentialsValid: boolean;

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
  postCredentials(data: NetsuiteConnectorPost): Observable<NetsuiteConnectorGet> {
    this.workspaceId = this.storageService.get('workspaceId');
    globalCacheBusterNotifier.next();
    return this.apiService.post(`/workspaces/${this.workspaceId}/credentials/netsuite/`, data);
  }

  connectionSuccess(){
    this.isLoadingSubject.next(false);
    this.setupConnectionStatusSubject.next(true);
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Reconnected to Netsuite successfully.', 6000);
  }

  connectNetsuite(connectNetsuiteForm: FormGroup, isReconnecting?: boolean){
    this.isLoadingSubject.next(true);
    this.workspaceId = this.storageService.get('workspaceId');
    const connectorPayload = NetsuiteConnectorModel.constructPayload(connectNetsuiteForm);
    this.postCredentials(connectorPayload).subscribe((response) => {
      this.isNetsuiteCredentialsValid = true;
      if (!isReconnecting){
        this.mappingsService.refreshNetsuiteDimensions(['subsidiaries']).subscribe(() => {
          this.connectionSuccess();
        });
      } else {
        this.connectionSuccess();
      }
    }, () => {
      this.setupConnectionStatusSubject.next(false);
      this.isLoadingSubject.next(false);
      this.connectNetsuiteFormSubject.next(NetsuiteConnectorModel.mapAPIResponseToFormGroup(this.netsuiteCredential));
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error while connecting, please try again later.');
    });
  }

  getNetsuiteFormGroup(isReconnecting?: boolean): void {
    if (!isReconnecting){
      this.isLoadingSubject.next(true);
    }
    this.getNetsuiteCredentials().pipe(
      tap((netsuiteCredential) => {
        this.netsuiteCredential = netsuiteCredential;
        this.connectNetsuiteFormSubject.next(NetsuiteConnectorModel.mapAPIResponseToFormGroup(netsuiteCredential));
        if (!isReconnecting){
          this.setupConnectionStatusSubject.next(true);
          this.isLoadingSubject.next(false);
        }
      }),
      catchError(() => {
        this.netsuiteCredential = null;
        this.connectNetsuiteFormSubject.next(NetsuiteConnectorModel.mapAPIResponseToFormGroup(null));
        if (!isReconnecting){
          this.setupConnectionStatusSubject.next(false);
          this.isLoadingSubject.next(false);
        }
        return EMPTY;
      })
    ).subscribe();
  }

  postSubsdiaryMapping(subsdiaryMappingPayload: NetsuiteSubsidiaryMappingPost): Observable<SubsidiaryMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/mappings/subsidiaries/`, subsdiaryMappingPayload);
  }

  getNetsuiteTokenHealthStatus(): Promise<boolean> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    if (this.isNetsuiteCredentialsValid === undefined){
    return new Promise((resolve) => {
      this.checkNetsuiteTokenHealth(workspaceId)
        .subscribe({
          next: () => {
            this.isNetsuiteCredentialsValid = true;
            resolve(true);
          },
          error: (error) => {
              this.isNetsuiteCredentialsValid = false;
              resolve(false);
          }
        });
    });
    }
      return Promise.resolve(this.isNetsuiteCredentialsValid);
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
