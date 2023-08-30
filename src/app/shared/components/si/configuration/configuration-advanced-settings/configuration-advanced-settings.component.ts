import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ConfigurationCta, PaymentSyncDirection, RedirectLink } from 'src/app/core/models/enum/enum.model';
import { AdvancedSettingFormOption, AdvancedSettingsGet } from 'src/app/core/models/si/si-configuration/advanced-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiAdvancedSettingService } from 'src/app/core/services/si/si-configuration/si-advanced-setting.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-configuration-advanced-settings',
  templateUrl: './configuration-advanced-settings.component.html',
  styleUrls: ['./configuration-advanced-settings.component.scss']
})
export class ConfigurationAdvancedSettingsComponent implements OnInit {

  isLoading: boolean = true;

  advancedSettingsForm: FormGroup;

  RedirectLink = RedirectLink;

  isOnboarding: boolean;

  saveInProgress: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  advancedSettings: AdvancedSettingsGet;

  memoPreviewText: string;

  memoStructure: string[] = [];

  defaultMemoFields: string[] = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];

  paymentSyncOptions: AdvancedSettingFormOption[] = [
    {
      label: 'None',
      value: null
    },
    {
      label: 'Export Fyle ACH Payments to Sage Intacct',
      value: PaymentSyncDirection.FYLE_TO_INTACCT
    },
    {
      label: 'Import Sage Intacct Online Payments into Fyle',
      value: PaymentSyncDirection.INTACCT_TO_FYLE
    }
  ];

  constructor(
    private router: Router,
    private advancedSettingsService: SiAdvancedSettingService,
    private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: SiWorkspaceService,
    private mappingService: SiMappingsService
  ) { }

  private formatMemoPreview(): void {
    const time = Date.now();
    const today = new Date(time);

    const previewValues: { [key: string]: string } = {
      employee_email: 'john.doe@acme.com',
      category: 'Meals and Entertainment',
      purpose: 'Client Meeting',
      merchant: 'Pizza Hut',
      report_number: 'C/2021/12/R/1',
      spent_on: today.toLocaleDateString(),
      expense_link: 'https://app.fylehq.com/app/main/#/enterprise/view_expense/'
    };
    this.memoPreviewText = '';
    const memo: string[] = [];
    this.memoStructure.forEach((field, index) => {
      if (field in previewValues) {
        const defaultIndex = this.defaultMemoFields.indexOf(this.memoStructure[index]);
        memo[defaultIndex] = previewValues[field];
      }
    });
    memo.forEach((field, index) => {
      this.memoPreviewText += field;
      if (index + 1 !== memo.length) {
        this.memoPreviewText = this.memoPreviewText + ' - ';
      }
    });
  }
  
  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingsForm.value.setDescriptionField;
    this.formatMemoPreview();
    this.advancedSettingsForm.controls.setDescriptionField.valueChanges.subscribe((memoChanges) => {
      console.log(memoChanges);
      this.memoStructure = memoChanges;
      this.formatMemoPreview();
    });
  }

  private initializeExportSettingsFormWithData(): void {
    this.advancedSettingsForm = this.formBuilder.group({
      scheduleAutoExport: [null],
      errorNotificationEmail: [null],
      autoSyncPayments: [null],
      autoCreateEmployeeVendor: [null],
      postEntriesCurrentPeriod: [null],
      setDescriptionField: [this.defaultMemoFields, Validators.required],
      skipSelectiveExpenses: [null],
      defaultLocation: [null],
      defaultDepartment: [null],
      defaultProject: [null],
      defaultClass: [null],
      defaultItems: [null],
      useEmployeeLocation: [null],
      useEmployeeDepartment: [null],
    });
    this.createMemoStructureWatcher();
  }
  

  private getSettingsAndSetupForm(): void {
    const advancedSettings$ = this.advancedSettingsService.getAdvancedSettings();

    forkJoin({
      advancedSettings: advancedSettings$
    }).subscribe(
      ({ advancedSettings }) => {

        this.advancedSettings = advancedSettings;
        this.initializeExportSettingsFormWithData();
        this.isLoading = false;
      });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
