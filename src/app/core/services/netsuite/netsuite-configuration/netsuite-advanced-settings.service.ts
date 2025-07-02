import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { Observable, Subject } from 'rxjs';
import { NetsuiteAdvancedSettingGet, NetsuiteAdvancedSettingPost } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-advanced-settings.model';
import { AdvancedSettingsService } from 'src/app/core/services/common/advanced-settings.service';
import { FormControl, FormGroup } from "@angular/forms";
import { EmailOption, SelectFormOption } from "../../../models/common/select-form-option.model";
import { DefaultDestinationAttribute } from "../../../models/db/destination-attribute.model";
import { AppName, NetsuiteDefaultLevelOptions, NetsuitePaymentSyncDirection, PaymentSyncDirection } from "../../../models/enum/enum.model";
import { AdvancedSettingValidatorRule } from "../../../models/common/advanced-settings.model";
import { HelperUtility } from "../../../models/common/helper.model";
import { brandingConfig, brandingFeatureConfig } from "src/app/branding/branding-config";
import { environment } from "src/environments/environment";
import { NetSuiteExportSettingGet } from "../../../models/netsuite/netsuite-configuration/netsuite-export-setting.model";
import { TranslocoService } from '@jsverse/transloco';


const advancedSettingsCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class NetsuiteAdvancedSettingsService extends AdvancedSettingsService {

  private apiService: ApiService = inject(ApiService);

  private workspaceService: WorkspaceService = inject(WorkspaceService);

  private translocoService: TranslocoService = inject(TranslocoService);

  static override getDefaultMemoOptions(): string[] {
    return AdvancedSettingsService.getDefaultMemoOptions();
  }

  static override getMemoOptions(exportSettings: NetSuiteExportSettingGet, appName: AppName): string[] {
    const defaultOptions = this.getDefaultMemoOptions();
    const cccExportType = exportSettings.configuration.corporate_credit_card_expenses_object;

    if (brandingFeatureConfig.featureFlags.advancedSettings.excludeCardNumberAndEmployeeNameInMemo) {
      return defaultOptions.filter(option => !['card_number', 'employee_name'].includes(option));
    }

    if (!cccExportType) {
      return defaultOptions.filter(option => option !== 'card_number');
    }

    return defaultOptions;
  }

  getPaymentSyncOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.netsuiteAdvancedSettings.exportACHPayments'),
        value: NetsuitePaymentSyncDirection.FYLE_TO_NETSUITE
      },
      {
        label: `Import NetSuite Payments into ${brandingConfig.brandName}`,
        value: NetsuitePaymentSyncDirection.NETSUITE_TO_FYLE
      }
    ];
  }

  getDefaultLevelOptions(): DefaultDestinationAttribute[] {
    return [
      {
        name: this.translocoService.translate('services.netsuiteAdvancedSettings.all'),
        id: NetsuiteDefaultLevelOptions.ALL
      },
      {
        name: this.translocoService.translate('services.netsuiteAdvancedSettings.transactionLine'),
        id: NetsuiteDefaultLevelOptions.TRANSACTION_LINE
      },
      {
        name: this.translocoService.translate('services.netsuiteAdvancedSettings.transactionBody'),
        id: NetsuiteDefaultLevelOptions.TRANSACTION_BODY
      }
    ];
  }

  static getValidators(): AdvancedSettingValidatorRule {
    return {
      paymentSync: 'paymentAccount',
      exportSchedule: 'exportScheduleFrequency'
    };
  }

  static setConfigurationSettingValidatorsAndWatchers(form: FormGroup): void {
    const validatorRule = this.getValidators();
    const keys = Object.keys(validatorRule);

    Object.values(validatorRule).forEach((value, index) => {
      form.controls[keys[index]].valueChanges.subscribe((selectedValue) => {
        if (selectedValue && ((keys[index] === 'paymentSync' && selectedValue === NetsuitePaymentSyncDirection.FYLE_TO_NETSUITE) || (keys[index] !== 'paymentSync'))) {
          HelperUtility.markControllerAsRequired(form, value);
        } else {
          HelperUtility.clearValidatorAndResetValue(form, value);
        }
      });
    });
  }

  mapAPIResponseToFormGroup(advancedSettings: NetsuiteAdvancedSettingGet, isSkipExportEnabled: boolean, adminEmails: EmailOption[], shouldEnableAccountingPeriod: boolean, isOnboarding: boolean): FormGroup {
    const level: DefaultDestinationAttribute[] = this.getDefaultLevelOptions();
    const findObjectByDestinationId = (id: string) => level?.find(item => item.id === id) || null;

    return new FormGroup({
      paymentSync: new FormControl(advancedSettings?.configuration.sync_fyle_to_netsuite_payments ? NetsuitePaymentSyncDirection.FYLE_TO_NETSUITE : advancedSettings?.configuration.sync_netsuite_to_fyle_payments ? NetsuitePaymentSyncDirection.NETSUITE_TO_FYLE : null),
      paymentAccount: new FormControl(advancedSettings?.general_mappings.vendor_payment_account?.id ? advancedSettings?.general_mappings.vendor_payment_account : null ),
      netsuiteLocation: new FormControl(advancedSettings?.general_mappings.netsuite_location?.id ? advancedSettings?.general_mappings.netsuite_location : null),
      useEmployeeLocation: new FormControl(advancedSettings?.general_mappings.use_employee_location ? advancedSettings?.general_mappings.use_employee_location : false),
      netsuiteLocationLevel: new FormControl(advancedSettings?.general_mappings.netsuite_location_level ? findObjectByDestinationId(advancedSettings?.general_mappings.netsuite_location_level) :  this.getDefaultLevelOptions()[0]),
      netsuiteDepartment: new FormControl(advancedSettings?.general_mappings.netsuite_department?.id ? advancedSettings?.general_mappings.netsuite_department : null),
      netsuiteDepartmentLevel: new FormControl(advancedSettings?.general_mappings.netsuite_department_level ? findObjectByDestinationId(advancedSettings?.general_mappings.netsuite_department_level) : this.getDefaultLevelOptions()[0]),
      useEmployeeDepartment: new FormControl(advancedSettings?.general_mappings.use_employee_department ? advancedSettings?.general_mappings.use_employee_department : false),
      netsuiteClass: new FormControl(advancedSettings?.general_mappings.netsuite_class?.id ? advancedSettings?.general_mappings.netsuite_class : null),
      netsuiteClassLevel: new FormControl(advancedSettings?.general_mappings.netsuite_class_level ? findObjectByDestinationId(advancedSettings?.general_mappings.netsuite_class_level) : this.getDefaultLevelOptions()[0]),
      useEmployeeClass: new FormControl(advancedSettings?.general_mappings.use_employee_class ? advancedSettings?.general_mappings.use_employee_class : false),
      changeAccountingPeriod: new FormControl(shouldEnableAccountingPeriod ? true : advancedSettings?.configuration.change_accounting_period),
      autoCreateVendors: new FormControl(advancedSettings?.configuration.auto_create_destination_entity),
      singleCreditLineJE: new FormControl(advancedSettings?.configuration.je_single_credit_line),
      exportSchedule: new FormControl(advancedSettings.workspace_schedules?.enabled || (isOnboarding && brandingFeatureConfig.featureFlags.dashboard.useRepurposedExportSummary) ? true : false),
      exportScheduleFrequency: new FormControl(this.getExportFrequency(advancedSettings.workspace_schedules?.is_real_time_export_enabled, isOnboarding, advancedSettings.workspace_schedules?.enabled, advancedSettings.workspace_schedules?.interval_hours)),
      memoStructure: new FormControl(advancedSettings?.configuration.memo_structure),
      autoCreateMerchants: new FormControl(advancedSettings?.configuration?.auto_create_merchants ? advancedSettings.configuration.auto_create_merchants : false),
      skipExport: new FormControl(isSkipExportEnabled),
      searchOption: new FormControl(),
      search: new FormControl(),
      additionalEmails: new FormControl([]),
      email: new FormControl(advancedSettings?.workspace_schedules?.emails_selected && advancedSettings?.workspace_schedules?.emails_selected?.length > 0 ? AdvancedSettingsService.filterAdminEmails(advancedSettings?.workspace_schedules?.emails_selected, adminEmails) : [])
    });
  }

  static constructPayload(advancedSettingsForm: FormGroup): NetsuiteAdvancedSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};

    const advancedSettingPayload: NetsuiteAdvancedSettingPost = {
      configuration: {
        sync_fyle_to_netsuite_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === NetsuitePaymentSyncDirection.FYLE_TO_NETSUITE ? true : false,
        sync_netsuite_to_fyle_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === NetsuitePaymentSyncDirection.NETSUITE_TO_FYLE ? true : false,
        auto_create_destination_entity: advancedSettingsForm.get('autoCreateVendors')?.value,
        change_accounting_period: advancedSettingsForm.get('changeAccountingPeriod')?.value,
        memo_structure: advancedSettingsForm.get('memoStructure')?.value,
        auto_create_merchants: advancedSettingsForm.get('autoCreateMerchants')?.value,
        je_single_credit_line: advancedSettingsForm.get('singleCreditLineJE')?.value || false
      },
      general_mappings: {
        vendor_payment_account: advancedSettingsForm.get('paymentAccount')?.value ? advancedSettingsForm.get('paymentAccount')?.value : emptyDestinationAttribute,
        netsuite_location: advancedSettingsForm.get('netsuiteLocation')?.value ? advancedSettingsForm.get('netsuiteLocation')?.value : emptyDestinationAttribute,
        netsuite_location_level: advancedSettingsForm.get('netsuiteLocationLevel')?.value ? advancedSettingsForm.get('netsuiteLocationLevel')?.value.id : '',
        netsuite_department: advancedSettingsForm.get('netsuiteDepartment')?.value ? advancedSettingsForm.get('netsuiteDepartment')?.value : emptyDestinationAttribute,
        netsuite_department_level: advancedSettingsForm.get('netsuiteDepartmentLevel')?.value ? advancedSettingsForm.get('netsuiteDepartmentLevel')?.value.id : '',
        netsuite_class: advancedSettingsForm.get('netsuiteClass')?.value ? advancedSettingsForm.get('netsuiteClass')?.value : emptyDestinationAttribute,
        netsuite_class_level: advancedSettingsForm.get('netsuiteClassLevel')?.value ? advancedSettingsForm.get('netsuiteClassLevel')?.value.id : '',
        use_employee_location: advancedSettingsForm.get('useEmployeeLocation')?.value,
        use_employee_class: advancedSettingsForm.get('useEmployeeClass')?.value,
        use_employee_department: advancedSettingsForm.get('useEmployeeDepartment')?.value
      },
      workspace_schedules: {
        enabled: advancedSettingsForm.get('exportSchedule')?.value ? true : false,
        interval_hours: Number.isInteger(advancedSettingsForm.get('exportScheduleFrequency')?.value) ? advancedSettingsForm.get('exportScheduleFrequency')!.value : null,
        is_real_time_export_enabled: advancedSettingsForm.get('exportSchedule')?.value && advancedSettingsForm.get('exportScheduleFrequency')?.value === 0 ? true : false,
        emails_selected: advancedSettingsForm.get('email')?.value ? AdvancedSettingsService.formatSelectedEmails(advancedSettingsForm.get('email')?.value) : null,
        additional_email_options: advancedSettingsForm.get('additionalEmails')?.value ? advancedSettingsForm.get('additionalEmails')?.value[0] : null
      }
    };
    return advancedSettingPayload;
  }

  @Cacheable({
    cacheBusterObserver: advancedSettingsCache$
  })
  getAdvancedSettings(): Observable<NetsuiteAdvancedSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_configurations/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: advancedSettingsCache$
  })
  postAdvancedSettings(exportSettingsPayload: NetsuiteAdvancedSettingPost): Observable<NetsuiteAdvancedSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_configurations/`, exportSettingsPayload);
  }
}
