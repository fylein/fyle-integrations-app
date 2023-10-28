import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppName, ConfigurationCta, FyleField, Sage300ExportType, Sage300Field, Sage300Link } from 'src/app/core/models/enum/enum.model';
import { Sage300DestinationAttributes } from 'src/app/core/models/sage300/db/sage300-destination-attribuite.model';
import { ExportSettingModel, Sage300ExportSettingFormOption, Sage300ExportSettingGet, ValidatorRule } from 'src/app/core/models/sage300/sage300-configuration/sage300-export-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { Sage300ExportSettingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-export-setting.service';
import { Sage300HelperService } from 'src/app/core/services/sage300/sage300-helper/sage300-helper.service';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
  selector: 'app-sage300-export-settings',
  templateUrl: './sage300-export-settings.component.html',
  styleUrls: ['./sage300-export-settings.component.scss']
})
export class Sage300ExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  isOnboarding: boolean;

  isSaveInProgress: boolean;

  exportSettings: Sage300ExportSettingGet;

  exportSettingForm: FormGroup;

  redirectLink: string = Sage300Link.EXPORT_SETTING;

  appName: string = AppName.SAGE300;

  Sage300ExportType = Sage300ExportType;

  ConfigurationCtaText = ConfigurationCta;

  expenseGroupByOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpenseGroupByOptions();

  expenseGroupingDateOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpenseGroupingDateOptions();

  expensesExportTypeOptions: Sage300ExportSettingFormOption[] = this.exportSettingService.getExpensesExportTypeOptions();

  reimbursableExpenseState: Sage300ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseState();

  cccExpenseState: Sage300ExportSettingFormOption[] = this.exportSettingService.getCCCExpenseState();

  validatorRule: ValidatorRule = {
    'reimbursableExpense': ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'reimbursableExpenseState'],
    'creditCardExpense': ['cccExportType', 'cccExportGroup', 'cccExportDate', 'cccExpenseState']
  };

  vendorOptions: Sage300DestinationAttributes[];

  creditCardAccountOptions: Sage300DestinationAttributes[];

  constructor(
    private exportSettingService: Sage300ExportSettingService,
    private router: Router,
    private helper: HelperService,
    private helperService: Sage300HelperService
  ) { }

  getExportType(exportType: string | null): string {
    return exportType ? new SnakeCaseToSpaceCasePipe().transform(new TitleCasePipe().transform(exportType)): 'expense';
  }

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
  }

  save() {
    // Will be added here soon
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.exportSettingService.getSage300ExportSettings().subscribe((Sage300ExportSettingResponse: Sage300ExportSettingGet) => {
      this.exportSettingService.getDestinationAttributes([FyleField.VENDOR, Sage300Field.ACCOUNT]).subscribe((response: Sage300DestinationAttributes[]) => {
        this.exportSettings = Sage300ExportSettingResponse;
        this.exportSettings.credit_card_expense_grouped_by = ['expense_id'];
        this.exportSettings.reimbursable_expense_grouped_by = ['expense_id'];
        this.exportSettingForm = ExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings);
        this.exportSettingForm.controls.reimbursableExpense.setValidators(this.helper.exportSelectionValidator(this.exportSettingForm));
        this.helper.setCustomValidatorsAndWatchers(this.validatorRule, this.exportSettingForm);
        this.vendorOptions = response;
        this.creditCardAccountOptions = response;
        this.isLoading = false;
      });
    }, (error) => {
      this.exportSettingForm = ExportSettingModel.mapAPIResponseToFormGroup();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
