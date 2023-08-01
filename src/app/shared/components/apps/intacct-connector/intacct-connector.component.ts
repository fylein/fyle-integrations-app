import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationCta, RedirectLink } from 'src/app/core/models/enum/enum.model';
import { StorageService } from 'src/app/core/services/core/storage.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiSettingsService } from 'src/app/core/services/si/si-settings.service';
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

  workspaceId: number;

  ConfigurationCtaText = ConfigurationCta;

  isOnboarding: boolean = true;

  saveInProgress: boolean = false;

  redirectLink: string = RedirectLink.INTACCT;

  wrongCredentials: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private si: SiComponent,
    private intacctConnector: OnboardingIntacctConnectorComponent,
    private settingsService: SiSettingsService,
    private mappingsService: SiMappingsService
  ) { }

    save() {
      const that = this;
      const userID = this.connectSageIntacctForm.value.userID;
      const companyID = this.connectSageIntacctForm.value.companyID;
      const userPassword = this.connectSageIntacctForm.value.userPassword;

      that.isLoading = true;
      that.settingsService.connectSageIntacct(that.workspaceId, {
        si_user_id: userID,
        si_company_id: companyID,
        si_user_password: userPassword
      }).subscribe((response) => {
        that.mappingsService.refreshSageIntacctDimensions(['location_entities']).subscribe(() => {
          this.intacctConnector.isLocationEntity();
          that.si.getSageIntacctCompanyName();
          that.isLoading = false;
        });
      }, () => {
        that.isLoading = false;
        that.wrongCredentials = true;
      });
    }

    connect() {
      const that = this;
      that.workspaceId = this.storageService.get('si.workspaceId');
      that.isLoading = true;
      that.settingsService.getSageIntacctCredentials(that.workspaceId).subscribe((res) => {
        that.connectSageIntacctForm = that.formBuilder.group({
          userID: [res.si_user_id ? res.si_user_id : ''],
          companyID: [res.si_company_id ? res.si_company_id : ''],
          userPassword: ['']
        });
        that.isLoading = false;
      }, () => {
        that.connectSageIntacctForm = that.formBuilder.group({
          userID: ['', Validators.required],
          companyID: ['', Validators.required],
          userPassword: ['', Validators.required]
        });
        that.isLoading = false;
      });
    }

  ngOnInit(): void {
    this.connect();
  }
}
