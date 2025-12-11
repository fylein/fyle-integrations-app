import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of, switchMap } from 'rxjs';
import { LocationEntityMapping } from 'src/app/core/models/intacct/db/location-entity-mapping.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { SiWorkspaceService } from './si-workspace.service';
import { StorageService } from '../../common/storage.service';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ts-cacheable';
import { SageIntacctCredential } from 'src/app/core/models/intacct/db/sage-credentials.model';
import { ApiService } from '../../common/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SiMappingsService } from './si-mappings.service';
import { IntegrationsToastService } from '../../common/integrations-toast.service';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { TranslocoService } from '@jsverse/transloco';
import { IntacctAuthorizationCodePayload } from 'src/app/core/models/intacct/intacct-configuration/connector.model';


const sageIntacctCredentialCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class IntacctConnectorService {

  workspaceId: number;

  intacctCredential: SageIntacctCredential | null = null;

  constructor(
    private apiService: ApiService,
    private workspaceService: SiWorkspaceService,
    private storageService: StorageService,
    private mappingsService: SiMappingsService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService
  ) { }

  postAuthCode(authorizationCodePayload: IntacctAuthorizationCodePayload): Observable<SageIntacctCredential> {
    return this.apiService.post(
      `/workspaces/${this.workspaceService.getWorkspaceId()}/sage_intacct/credentials/authorization_code/`,
      authorizationCodePayload
    );
  }

  mapAPIResponseToSage300ConnectorFormGroup(sageIntacctConnection: SageIntacctCredential | null): FormGroup {
    const isDisabled = sageIntacctConnection?.si_company_id ? true : false;
    return new FormGroup({
      companyID: new FormControl({value: sageIntacctConnection?.si_company_id ? sageIntacctConnection?.si_company_id : null, disabled: isDisabled}, Validators.required),
      userID: new FormControl('', Validators.required),
      userPassword: new FormControl('', Validators.required)
    });
  }

  constructSage300ConnectionPayload(form: FormGroup): SageIntacctCredential {
    return {
      si_user_id: form.get('userID')?.value,
      si_company_id: form.get('companyID')?.value,
      si_user_password: form.get('userPassword')?.value
    };
  }

  @Cacheable({
    cacheBusterObserver: sageIntacctCredentialCache
  })
  getSageIntacctCredential(): Observable<SageIntacctCredential> {
    this.workspaceId = this.storageService.get('workspaceId');
    return this.apiService.get('/workspaces/' + this.workspaceId + '/credentials/sage_intacct/', {});
  }

  @CacheBuster({
    cacheBusterNotifier: sageIntacctCredentialCache
  })
  private postCredentials(data: SageIntacctCredential): Observable<SageIntacctCredential> {
    this.workspaceId = this.storageService.get('workspaceId');
    globalCacheBusterNotifier.next();
    return this.apiService.post('/workspaces/' + this.workspaceId + '/credentials/sage_intacct/', data);
  }

  connectSageIntacct(connectIntacctForm: FormGroup, isReconnecting?: boolean): Observable<{intacctSetupForm: FormGroup, isIntacctConnected: boolean}> {
    this.workspaceId = this.storageService.get('workspaceId');
    const connectorPayload = this.constructSage300ConnectionPayload(connectIntacctForm);
    return this.postCredentials(connectorPayload).pipe(
      switchMap((response) => {
        if (!isReconnecting) {
          return this.mappingsService.refreshSageIntacctDimensions(['location_entities']).pipe(
            map(() => {
              return { intacctSetupForm: this.mapAPIResponseToSage300ConnectorFormGroup(response), isIntacctConnected: true };
            })
          );
        }
          this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('services.siConnector.connectionReconnectedToast'), 6000);
          return of({ intacctSetupForm: this.mapAPIResponseToSage300ConnectorFormGroup(response), isIntacctConnected: true });

      }),
      catchError(() => {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('services.siConnector.connectionErrorToast'), 6000);
        return of({ intacctSetupForm: this.mapAPIResponseToSage300ConnectorFormGroup(this.intacctCredential), isIntacctConnected: false });
      })
    );
  }

  getIntacctFormGroup(): Observable<{intacctSetupForm: FormGroup}> {
    return this.getSageIntacctCredential().pipe(
      map((intacctCredential) => {
        this.intacctCredential = intacctCredential;
        return { intacctSetupForm: this.mapAPIResponseToSage300ConnectorFormGroup(intacctCredential) };
      }),
      catchError(() => {
        this.intacctCredential = null;
        return of({
          intacctSetupForm: this.mapAPIResponseToSage300ConnectorFormGroup(null)
        });
      })
    );
  }

  @Cacheable()
  checkIntacctTokenHealth(workspaceId: string): Observable<{}> {
    return this.apiService.get(`/workspaces/${workspaceId}/token_health/`, {});
  }

  getIntacctTokenHealthStatus(shouldShowTokenExpiredMessage?: boolean): Observable<boolean> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.checkIntacctTokenHealth(workspaceId).pipe(
      map(() => {
        return true;
      }),
      catchError((error) => {
        if (error.error.message !== "Intacct credentials not found" && shouldShowTokenExpiredMessage) {
          this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('services.siConnector.connectionExpiredToast'), 6000);
        }
        return of(false);
      })
    );
  }

  postLocationEntityMapping(locationEntityMappingPayload: LocationEntityMapping): Observable<LocationEntityMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/mappings/location_entity/`, locationEntityMappingPayload);
  }

  getLocationEntityMapping(): Observable<LocationEntityMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/location_entity/`, {}
    );
  }
}
