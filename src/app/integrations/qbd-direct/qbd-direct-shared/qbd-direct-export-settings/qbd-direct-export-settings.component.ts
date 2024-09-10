import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppName, ConfigurationCta, QBDCorporateCreditCardExpensesObject, QBDExpenseGroupedBy } from 'src/app/core/models/enum/enum.model';
import { QbdDirectExportSettingGet, QbdDirectExportSettingModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { QbdDirectExportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.service';
import { QbdExportSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-setting.service';
import { QBDExportSettingFormOption } from '/Users/fyle/integrations/fyle-integrations-app/src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { Observable } from 'rxjs/internal/Observable';
import { PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { filter, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-export-settings',
  templateUrl: './qbd-direct-export-settings.component.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  styleUrl: './qbd-direct-export-settings.component.scss'
})
export class QbdDirectExportSettingsComponent implements OnInit{

  isLoading: boolean;

  isOnboarding: any;

  exportSettings: QbdDirectExportSettingGet | null;

  is_simplify_report_closure_enabled: any;

  exportSettingsForm: FormGroup;

  cccExpenseGroupingDateOptions: QBDExportSettingFormOption[];

  cccExpenseStateOptions: QBDExportSettingFormOption[];

  expenseStateOptions: QBDExportSettingFormOption[];

  reimbursableExpenseGroupingFieldOptions: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.expenseGroupingFieldOptions();

  creditCardExpenseGroupingFieldOptions: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.expenseGroupingFieldOptions();

  reimbursableExpenseGroupingDateOptions: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.reimbursableExpenseGroupingDateOptions();

  creditCardExportTypes: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.creditCardExportTypes();

  reimbursableExportTypes: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.reimbursableExportTypes();

  cccEntityNameOptions: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.cccEntityNameOptions();

  appName: AppName = AppName.QBD_DIRECT;

  redirectLink: string = brandingKbArticles.topLevelArticles.QBD;

  readonly brandingConfig = brandingConfig;

  readonly brandingContent = brandingContent.qbd_direct.configuration.exportSetting;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  QBDCorporateCreditCardExpensesObject = QBDCorporateCreditCardExpensesObject;

  isSaveInProgress: boolean;

  ConfigurationCtaText = ConfigurationCta;

  constructor(
    private router: Router,
    private exportSettingService: QbdExportSettingService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    // Private workspaceService: QbdWorkspaceService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    public helperService: HelperService,
    private mappingService: MappingService
  ) { }

  save() {
    throw new Error('Method not implemented.');
  }

  navigateToPreviousStep() {
    throw new Error('Method not implemented.');
  }

  refreshDimensions() {}

  cccExportTypeWatcher(): void {
    this.exportSettingsForm.controls.creditCardExportType.valueChanges.subscribe((creditCardExportTypeValue) => {
      if (creditCardExportTypeValue === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE) {
        this.exportSettingsForm.controls.creditCardExportGroup.patchValue(this.creditCardExpenseGroupingFieldOptions[1].value);
        this.exportSettingsForm.controls.creditCardExportGroup.disable();
        this.creditCardExpenseGroupingFieldOptions = [QbdDirectExportSettingModel.expenseGroupingFieldOptions()[1]];
      } else {
        this.exportSettingsForm.controls.creditCardExportGroup.enable();
        this.creditCardExpenseGroupingFieldOptions = QbdDirectExportSettingModel.expenseGroupingFieldOptions();
      }
    });
  }

  reimbursableExpenseGroupWatcher(): void {
    this.exportSettingsForm.controls.reimbursableExportGroup.valueChanges.subscribe((reimbursableExportGroupValue) => {
      if (reimbursableExportGroupValue === QBDExpenseGroupedBy.REPORT) {
        this.reimbursableExpenseGroupingDateOptions = [QbdDirectExportSettingModel.reimbursableExpenseGroupingDateOptions()[1]];
      } else {
        this.reimbursableExpenseGroupingDateOptions = QbdDirectExportSettingModel.reimbursableExpenseGroupingDateOptions();
      }
    });
  }

  cccExpenseGroupWatcher(): void {
    this.exportSettingsForm.controls.creditCardExportGroup.valueChanges.subscribe((creditCardExportGroupValue) => {
      this.cccExpenseGroupingDateOptions = QbdDirectExportSettingModel.setCreditCardExpenseGroupingDateOptions(this.exportSettingsForm.controls.creditCardExportType.value, creditCardExportGroupValue);
    });
  }

  private exportsettingsWatcher(): void {

    this.cccExportTypeWatcher();

    this.reimbursableExpenseGroupWatcher();
    this.cccExpenseGroupWatcher();
  }

  private setupCCCExpenseGroupingDateOptions(): void {
    if (this.exportSettings?.credit_card_expense_export_type) {
      const creditCardExpenseExportGroup = this.exportSettings?.credit_card_expense_grouped_by ? this.exportSettings?.credit_card_expense_grouped_by : QBDExpenseGroupedBy.EXPENSE;
      this.cccExpenseGroupingDateOptions = QbdDirectExportSettingModel.setCreditCardExpenseGroupingDateOptions(this.exportSettings?.credit_card_expense_export_type, creditCardExpenseExportGroup);
    } else {
      this.cccExpenseGroupingDateOptions = QbdDirectExportSettingModel.setCreditCardExpenseGroupingDateOptions(QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE, QBDExpenseGroupedBy.EXPENSE);
    }
  }

  private getSettingsAndSetupForm(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');

    const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT'];

    const groupedAttributes: Observable<PaginatedDestinationAttribute>[]= [];

    destinationAttributes.forEach((destinationAttribute) => {
      groupedAttributes.push(this.mappingService.getPaginatedDestinationAttributes(destinationAttribute).pipe(filter(response => !!response)));
    });

    forkJoin([
      this.exportSettingService.getQbdExportSettings()
      // ...groupedAttributes
    ]).subscribe(([exportSettingResponse]) => {
      this.exportSettings = exportSettingResponse;
      this.is_simplify_report_closure_enabled = this.exportSettings?.is_simplify_report_closure_enabled;

      // Console.log(bankAccount, cccAccount);
      this.cccExpenseStateOptions = QbdDirectExportSettingModel.cccExpenseStateOptions(this.is_simplify_report_closure_enabled);
      this.expenseStateOptions = QbdDirectExportSettingModel.expenseStateOptions(this.is_simplify_report_closure_enabled);

      this.setupCCCExpenseGroupingDateOptions();

      this.exportSettingsForm = QbdDirectExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings);

      this.helperService.addExportSettingFormValidator(this.exportSettingsForm);

      const [exportSettingValidatorRule, exportModuleRule] = QbdDirectExportSettingModel.getValidators();

      this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingsForm);

      this.exportsettingsWatcher();

      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.getSettingsAndSetupForm();
  }

}
