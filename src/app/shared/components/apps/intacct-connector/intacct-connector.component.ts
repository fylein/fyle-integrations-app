import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationCta } from 'src/app/core/models/enum/enum.model';
import { StorageService } from 'src/app/core/services/core/storage.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiSettingsService } from 'src/app/core/services/si/si-settings.service';
import { SiComponent } from 'src/app/integrations/si/si.component';

@Component({
  selector: 'app-intacct-connector',
  templateUrl: './intacct-connector.component.html',
  styleUrls: ['./intacct-connector.component.scss']
})
export class IntacctConnectorComponent implements OnInit {

  isLoading: boolean = true;

  locationEntity: boolean = false;

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
      console.log(this.connectSageIntacctForm);
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
          that.isLoading = false;
          that.si.getSageIntacctCompanyName();
        });
      }, () => {
        that.isLoading = false;
        that.locationEntity = true;
      });
    }

    connect() {
      const that = this;
      that.workspaceId = this.storageService.get('si.workspaceId');
      that.isLoading = false;
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
        this.connectSageIntacctForm.controls.companyID.valueChanges.subscribe((abcd) => {
          console.log(abcd, this.connectSageIntacctForm);
        })
      });
    }

  ngOnInit(): void {
    this.connect();
  }

}
