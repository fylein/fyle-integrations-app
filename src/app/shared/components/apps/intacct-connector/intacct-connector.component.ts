import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationCta, RedirectLink, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { StorageService } from 'src/app/core/services/core/storage.service';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { OnboardingIntacctConnectorComponent } from 'src/app/integrations/si/onboarding/onboarding-intacct-connector/onboarding-intacct-connector.component';
import { SiComponent } from 'src/app/integrations/si/si.component';

@Component({
  selector: 'app-intacct-connector',
  templateUrl: './intacct-connector.component.html',
  styleUrls: ['./intacct-connector.component.scss']
})
export class IntacctConnectorComponent implements OnInit {

  isLoading: boolean = true;

  connectSageIntacctForm: FormGroup;

  ConfigurationCtaText = ConfigurationCta;

  isOnboarding: boolean = false;

  saveInProgress: boolean = false;

  redirectLink: string = RedirectLink.INTACCT;

  wrongCredentials: boolean = false;

  windowReference: Window;

  @Output() isIntacctConnected = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private si: SiComponent,
    private intacctConnector: OnboardingIntacctConnectorComponent,
    private connectorService: IntacctConnectorService,
    private mappingsService: SiMappingsService,
    private toastService: IntegrationsToastService
  ) { }

    save() {
      const userID = this.connectSageIntacctForm.value.userID;
      const companyID = this.connectSageIntacctForm.value.companyID;
      const userPassword = this.connectSageIntacctForm.value.userPassword;

      this.isLoading = true;
      this.connectorService.connectSageIntacct({
        si_user_id: userID,
        si_company_id: companyID,
        si_user_password: userPassword
      }).subscribe((response) => {
        this.mappingsService.refreshSageIntacctDimensions(['location_entities']).subscribe(() => {
          this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Connection Successful.');
          this.isLoading = false;
        });
      }, () => {
        this.isLoading = false;
        this.wrongCredentials = true;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error while connecting, please try again later.');
      });
    }

    setupPage() {
      this.isLoading = true;
      this.connectorService.getSageIntacctCredential().subscribe((intacctCredential) => {
        this.connectSageIntacctForm = this.formBuilder.group({
          userID: [''],
          companyID: [''],
          userPassword: ['']
        });
        this.isIntacctConnected.emit(true);
        this.isLoading = false;
      }, () => {
        this.connectSageIntacctForm = this.formBuilder.group({
          userID: ['', Validators.required],
          companyID: ['', Validators.required],
          userPassword: ['', Validators.required]
        });
        this.isLoading = false;
      });
    }

  ngOnInit(): void {
    this.setupPage();
  }
}
