import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { catchError, concat, forkJoin, merge, of, toArray } from 'rxjs';
import { BambooHr, BambooHRConfiguration, BambooHRConfigurationPost, BambooHrModel, EmailOption } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import { Org } from 'src/app/core/models/org/org.model';
import { BambooHrService } from 'src/app/core/services/bamboo-hr/bamboo-hr.service';
import { OrgService } from 'src/app/core/services/org/org.service';

@Component({
  selector: 'app-bamboo-hr',
  templateUrl: './bamboo-hr.component.html',
  styleUrls: ['./bamboo-hr.component.scss']
})
export class BambooHrComponent implements OnInit {

  showDialog: boolean;

  isBambooConnected: boolean;

  isBambooConnectionInProgress: boolean;

  isBambooSetupInProgress: boolean;

  isLoading: boolean = true;

  bambooHrData: BambooHr;

  org: Org = this.orgService.getCachedOrg();

  bambooConnectionForm: FormGroup = this.formBuilder.group({
    apiToken: [null, Validators.required],
    subDomain: [null, Validators.required]
  });

  bambooHrConfiguration: BambooHRConfiguration;

  additionalEmails: EmailOption[];

  showErrorScreen: boolean;

  constructor(
    private bambooHrService: BambooHrService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private orgService: OrgService
  ) { }

  openDialog(): void {
   this.showDialog = true;
  }

  connectBambooHR(): void {
    this.isBambooConnectionInProgress = true;
    const bambooConnectionPayload = BambooHrModel.constructBambooConnectionPayload(this.bambooConnectionForm);
    forkJoin([
      this.bambooHrService.connectBambooHR(bambooConnectionPayload),
      this.orgService.connectFyle()
    ]).subscribe(() => {
      this.isBambooConnected = true;
      this.isBambooConnectionInProgress = false;
      this.showDialog = false;
    }, () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Connecting Bamboo HR Failed',
        detail: `Invalid Credentials`,
        life: 7000
      });
      this.isBambooConnectionInProgress = false;
    });
  }

  configurationUpdatesHandler(payload: BambooHRConfigurationPost): void {
    this.isLoading = true;
    this.bambooHrService.postConfigurations(payload).subscribe((updatedConfiguration: BambooHRConfiguration) => {
      this.bambooHrConfiguration = updatedConfiguration;
      this.isLoading = false;
    });
  }

  syncEmployees(): void {
    this.isLoading = true;
    this.bambooHrService.syncEmployees().subscribe(() => this.isLoading = false);
  }

  disconnectBambooHr(): void {
    this.isLoading = true;
    this.bambooHrService.disconnectBambooHr().subscribe(() => {
      this.isBambooConnected = false;
      this.isLoading = false;
    });
  }

  private setupBambooHr(): void {
    this.isBambooSetupInProgress = true;
    const syncData = [];

    if (!this.org.managed_user_id) {
      syncData.push(this.orgService.createWorkatoWorkspace());
    }

    if (!this.bambooHrData || !this.bambooHrData.folder_id) {
      syncData.push(this.bambooHrService.createFolder());
    }

    if (!this.bambooHrData || !this.bambooHrData.package_id) {
      syncData.push(this.bambooHrService.uploadPackage());
    }

    concat(...syncData).pipe(
      toArray()
    ).subscribe(() => {
      this.getBambooHrConfiguration();
      this.isBambooSetupInProgress = false;
    }, () => {
      this.isLoading = false;
      this.isBambooSetupInProgress = false;
      this.showErrorScreen = true;
    });
  }

  private getBambooHrConfiguration(): void {
    const data = merge(
      this.orgService.getAdditionalEmails(),
      this.bambooHrService.getConfigurations().pipe(catchError(() => of(null)))
    );

    data.pipe(toArray()).subscribe((responses) => {
      responses.forEach((response: any) => {
        if (Array.isArray(response) && response.length) {
          this.additionalEmails = response;
        } else if (response?.hasOwnProperty('additional_email_options')) {
          this.bambooHrConfiguration = response;
        }
      });
      this.isLoading = false;
    });
  }

  private setupPage(): void {
    this.bambooHrService.getBambooHRData().subscribe((bambooHrData: BambooHr) => {
      this.isBambooConnected = bambooHrData.sub_domain && bambooHrData.api_token ? true : false;
      this.bambooHrData = bambooHrData;
      this.getBambooHrConfiguration();
    }, () => {
      this.isBambooConnected = false;
      this.setupBambooHr();
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
