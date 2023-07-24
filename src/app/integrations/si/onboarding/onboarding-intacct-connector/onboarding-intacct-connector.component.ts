import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationCta } from 'src/app/core/models/enum/enum.model';
import { StorageService } from 'src/app/core/services/core/storage.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiSettingsService } from 'src/app/core/services/si/si-settings.service';
import { SiComponent } from '../../si.component';

@Component({
  selector: 'app-onboarding-intacct-connector',
  templateUrl: './onboarding-intacct-connector.component.html',
  styleUrls: ['./onboarding-intacct-connector.component.scss']
})
export class OnboardingIntacctConnectorComponent implements OnInit {

  isLoading: boolean;

  isSaveDisabled: boolean;

  connectSageIntacctForm: FormGroup;

  workspaceId: number;

  ConfigurationCtaText = ConfigurationCta;

  isOnboarding: boolean = true;

  saveInProgress: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private si: SiComponent,
    private settingsService: SiSettingsService,
    private mappingsService: SiMappingsService
  ) { }

    save() {
      const that = this;
      const userID = this.connectSageIntacctForm.value.userID;
      const companyID = this.connectSageIntacctForm.value.companyID;
      const companyName = this.connectSageIntacctForm.value.companyName;
      const userPassword = this.connectSageIntacctForm.value.userPassword;

      that.isLoading = true;
      that.settingsService.connectSageIntacct(that.workspaceId, {
        si_user_id: userID,
        si_company_id: companyID,
        si_company_name: companyName,
        si_user_password: userPassword
      }).subscribe((response) => {
        that.mappingsService.refreshSageIntacctDimensions(['location_entities']).subscribe(() => {
          that.isLoading = false;
          that.si.getSageIntacctCompanyName();
        });
      }, () => {
        that.isLoading = false;
      });
    }

    connect() {
      const that = this;
      that.isSaveDisabled = false;
      that.workspaceId = this.storageService.get('si.workspaceId');
      that.isLoading = false;
      that.settingsService.getSageIntacctCredentials(that.workspaceId).subscribe((res) => {
        that.connectSageIntacctForm = that.formBuilder.group({
          userID: [res.si_user_id ? res.si_user_id : ''],
          companyID: [res.si_company_id ? res.si_company_id : ''],
          companyName: [res.si_company_name ? res.si_company_name : ''],
          userPassword: ['']
        });
        that.isLoading = false;
      }, () => {
        that.isLoading = false;
        that.connectSageIntacctForm = that.formBuilder.group({
          userID: ['', Validators.required],
          companyID: ['', Validators.required],
          companyName: ['', Validators.required],
          userPassword: ['', Validators.required]
        });
      });
    }

  ngOnInit(): void {
    this.connect();
  }
}
