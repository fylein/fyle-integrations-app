import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { concat, concatAll, concatMap, toArray } from 'rxjs';
import { BambooHr } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import { Org } from 'src/app/core/models/org/org.model';
import { BambooHrService } from 'src/app/core/services/bamboo-hr/bamboo-hr.service';
import { OrgService } from 'src/app/core/services/org/org.service';

@Component({
  selector: 'app-bamboo-hr',
  templateUrl: './bamboo-hr.component.html',
  styleUrls: ['./bamboo-hr.component.scss']
})
export class BambooHrComponent implements OnInit {

  showDialog: boolean = false;

  isBambooConnected: boolean = false;

  isBambooConnectionInProgress: boolean = false;

  isRecipeActive: boolean = false;

  isBambooSetupInProgress: boolean = false;

  isLoading: boolean = true;

  bambooHrData: BambooHr;

  org: Org = this.orgService.getCachedOrg();

  bambooConnectionForm: FormGroup = this.formBuilder.group({
    apiToken: [null, Validators.required],
    subDomain: [null, Validators.required]
  });

  constructor(
    private bambooHrService: BambooHrService,
    private formBuilder: FormBuilder,
    private orgService: OrgService
  ) { }

  openDialog(): void {
   this.showDialog = true;
  }

  connectBambooHR(): void {
    // TODO
    if (this.bambooConnectionForm.valid) {
      this.isBambooConnectionInProgress = true;
      setTimeout(() => {
        this.isBambooConnectionInProgress = false;
        this.showDialog = false;
      }, 1000);
    }
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
    ).subscribe((a) => {
      this.isLoading = false;
      this.isBambooSetupInProgress = false;
    }, () => {
      this.isLoading = false;
      this.isBambooSetupInProgress = false;
    });

  }

  private setupPage(): void {
    this.bambooHrService.getBambooHRData().subscribe((bambooHrData: BambooHr) => {
      this.isBambooConnected = bambooHrData.sub_domain && bambooHrData.api_token ? true : false;
      this.bambooHrData = bambooHrData;
      this.isLoading = false;
    }, () => {
      this.isBambooConnected = false;
      this.setupBambooHr();
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
