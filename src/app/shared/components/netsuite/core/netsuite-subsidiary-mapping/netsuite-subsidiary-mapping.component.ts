import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ConfigurationCta, NetsuiteOnboardingState, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { NetsuiteDestinationAttribute } from 'src/app/core/models/netsuite/db/destination-attribute.model';
import { NetsuiteSubsidiaryMappingModel, SubsidiaryMapping } from 'src/app/core/models/netsuite/db/subsidiary-mapping.model';
import { NetsuiteSubsidiaryMappingPost } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-connector.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';
import { NetsuiteMappingsService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-mappings.service';
import { NetsuiteWorkspaceService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-workspace.service';

@Component({
  selector: 'app-netsuite-subsidiary-mapping',
  templateUrl: './netsuite-subsidiary-mapping.component.html',
  styleUrls: ['./netsuite-subsidiary-mapping.component.scss']
})


export class NetsuiteSubsidiaryMappingComponent implements OnInit {

  netsuiteSubsidiaryForm: FormGroup;

  netsuiteSubsidiaryOptions: NetsuiteDestinationAttribute[];

  netsuiteSubsidiary: SubsidiaryMapping;

  isLoading: boolean = true;

  isOnboarding: boolean;

  isRefreshDimensionInProgress: boolean;

  saveInProgress: boolean = false;

  workspaceId: number;

  ConfigurationCtaText = ConfigurationCta;

  redirectLink: string = brandingKbArticles.onboardingArticles.INTACCT.CONNECTOR;

  fyleOrgName: string = this.userService.getUserProfile().org_name;

  readonly brandingConfig = brandingConfig;

  constructor(
    private formBuilder: FormBuilder,
    private netsuiteMappingsService: NetsuiteMappingsService,
    private mappingService: MappingService,
    private connectorService: NetsuiteConnectorService,
    private userService: UserService,
    private storageService: StorageService,
    private router: Router,
    private workspaceService: NetsuiteWorkspaceService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService
  ) { }

  patchFormValue(event: any): void {
    this.netsuiteSubsidiaryForm.controls.netsuiteSubsidiary.patchValue(event.value);
  }

  save() {
    this.isLoading = true;
    this.saveInProgress = true;

    const netsuiteSubsidiaryId = this.netsuiteSubsidiaryForm.value.netsuiteSubsidiary;
    const netsuiteSubsidiaryMappingPayload: NetsuiteSubsidiaryMappingPost = NetsuiteSubsidiaryMappingModel.constructPayload(netsuiteSubsidiaryId, this.netsuiteSubsidiaryOptions, this.workspaceId)

    this.connectorService.postSubsdiaryMapping(netsuiteSubsidiaryMappingPayload).subscribe(
      (netsuiteSubsidiary) => {
        this.netsuiteSubsidiary = netsuiteSubsidiary;
        this.isLoading = false;
        this.handleSuccess(netsuiteSubsidiaryMappingPayload);
      },
      () => {
        this.isLoading = false;
        this.saveInProgress = false;
      }
    );
  }

  navigateToExportSetting() {
    this.router.navigate(['/integrations/netsuite/onboarding/export_settings']);
  }

  private setOnboardingStateAndRedirect(netsuiteSubsidiaryMappingPayload: NetsuiteSubsidiaryMappingPost): void {
    if (this.workspaceService.getNetsuiteOnboardingState() === NetsuiteOnboardingState.CONNECTION) {
      this.trackingService.integrationsOnboardingCompletion(TrackingApp.NETSUITE, NetsuiteOnboardingState.CONNECTION, 2, netsuiteSubsidiaryMappingPayload);
    }

    if (this.isOnboarding) {
      this.workspaceService.setNetsuiteOnboardingState(NetsuiteOnboardingState.EXPORT_SETTINGS);
      this.router.navigate(['/integrations/netsuite/onboarding/export_settings']);
    }
    this.isLoading = false;
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Subsidiary Selected Successfully.');
  }

  private handleSuccess(netsuiteSubsidiaryMappingPayload: NetsuiteSubsidiaryMappingPost): void {
    this.isRefreshDimensionInProgress = true;
    this.netsuiteMappingsService.refreshNetsuiteDimensions().subscribe(() => {
      this.setOnboardingStateAndRedirect(netsuiteSubsidiaryMappingPayload);
    }, () => {
      this.setOnboardingStateAndRedirect(netsuiteSubsidiaryMappingPayload);
    });
  }

  private setupPage() {
    this.workspaceId = this.storageService.get('workspaceId');
    this.isOnboarding = this.router.url.includes('onboarding');
    this.mappingService.getDestinationAttributes('SUBSIDIARY', 'v2', 'netsuite').subscribe((subsidiaries) => {
      this.netsuiteSubsidiaryOptions = subsidiaries;
      this.setupSubsidiaryMapping();
    });
  }

  private setupSubsidiaryMapping() {
    this.connectorService.getSubsidiaryMapping().subscribe(netsuiteSubsidiaryMappings => {
      this.netsuiteSubsidiary = netsuiteSubsidiaryMappings;
      this.netsuiteSubsidiaryForm = this.formBuilder.group({
        netsuiteSubsidiary: [this.netsuiteSubsidiary ? this.netsuiteSubsidiary : '']
      });
      this.netsuiteSubsidiaryForm.controls.netsuiteSubsidiary.disable();
      this.isLoading = false;
    }, () => {
      this.netsuiteSubsidiaryForm = this.formBuilder.group({
        netsuiteSubsidiary: [null, Validators.required]
      });
      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.setupPage();
  }
}
