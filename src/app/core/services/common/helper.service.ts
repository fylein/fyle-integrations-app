import { EventEmitter, Inject, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { AppUrlMap } from '../../models/integrations/integrations.model';
import { AppUrl, BusinessCentralExportType, ExpenseGroupingFieldOption, ExpenseState, FyleField, ProgressPhase, Sage300ExportType, XeroCorporateCreditCardExpensesObject, XeroReimbursableExpensesObject } from '../../models/enum/enum.model';
import { AbstractControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ExportModuleRule, ExportSettingValidatorRule } from '../../models/sage300/sage300-configuration/sage300-export-setting.model';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { SkipExportValidatorRule, skipExportValidator } from '../../models/common/advanced-settings.model';
import { StorageService } from './storage.service';
import { brandingConfig } from 'src/app/branding/branding-config';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { TitleCasePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  @Output() oauthCallbackUrl: EventEmitter<string> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private storageService: StorageService
  ) {}

  get apiBaseUrl(): string {
    return this.storageService.get('cluster-domain') || environment.cluster_domain_api_url;
  }

  setBaseApiURL(appUrl: string| void): void {
    const urlSplit = this.router.url.split('/');
    let module: AppUrl;

    if (appUrl) {
      // Condition 1: If appUrl is truthy, use it as AppUrl
      module = appUrl as AppUrl;
    } else {
      // Condition 2: If appUrl is falsy, determine module based on urlSplit length
      module = (urlSplit.length > 2 ? urlSplit[2] : urlSplit[1]) as AppUrl;
    }

    const apiUrlMap: AppUrlMap = {
      [AppUrl.INTACCT]: environment.production ? `${this.apiBaseUrl}/intacct-api/api` : environment.si_api_url,
      [AppUrl.QBD]: environment.qbd_api_url,
      [AppUrl.TRAVELPERK]: `${this.apiBaseUrl}/${environment.production ? 'integrations-api/': ''}api`,
      [AppUrl.BAMBOO_HR]: `${this.apiBaseUrl}/${environment.production ? 'integrations-api/': ''}api`,
      [AppUrl.SAGE300]: environment.sage300_api_url,
      [AppUrl.INTEGRATION]: `${this.apiBaseUrl}/${environment.production ? 'integrations-api/': ''}api`,
      [AppUrl.BUSINESS_CENTRAL]: environment.business_central_api_url,
      [AppUrl.QBO]: environment.production ? `${this.apiBaseUrl}/quickbooks-api/api` : environment.qbo_api_url,
      [AppUrl.NETSUITE]: environment.production ? `${this.apiBaseUrl}/netsuite-api/api` : environment.netsuite_api_url,
      [AppUrl.XERO]: environment.production ? `${this.apiBaseUrl}/xero-api/api` : environment.xero_api_url
    };

    const apiUrl = apiUrlMap[module] ?? apiUrlMap.integration;
    this.apiService.setBaseApiURL(apiUrl);
  }

  getAppName(): string {
    const appName = this.router.url.split('/')[2];
    return appName;
  }

  isFieldRequired(form: FormGroup, controllerName: string): boolean {
    return form.controls[controllerName].hasValidator(Validators.required);
  }

  markControllerAsRequired(form: FormGroup, controllerName: string): void {
    form.controls[controllerName].addValidators(Validators.required);
  }

  clearValidatorAndResetValue(form: FormGroup, controllerName: string, commonFormFields: string[] | void): void {
    form.controls[controllerName].clearValidators();
    if (commonFormFields) {
      if (commonFormFields.indexOf(controllerName) === -1) {
        form.controls[controllerName].reset();
      }
    } else {
      form.controls[controllerName].reset();
    }
  }

  setSage300ExportTypeControllerValue(form: FormGroup, controllerName: string): void {
    form.controls[controllerName].setValue(Sage300ExportType.PURCHASE_INVOICE);
  }

  setXeroExportTypeControllerValue(form: FormGroup, controllerName: string): void {
    if (controllerName === 'reimbursableExportType') {
      form.controls[controllerName].patchValue(XeroReimbursableExpensesObject.PURCHASE_BILL);
      form.controls.reimbursableExportGroup.patchValue(ExpenseGroupingFieldOption.CLAIM_NUMBER);
    } else {
      form.controls[controllerName].patchValue(XeroCorporateCreditCardExpensesObject.BANK_TRANSACTION);
      form.controls.creditCardExportGroup.patchValue(ExpenseGroupingFieldOption.EXPENSE_ID);
    }
  }

  enableFormField(form: FormGroup, controllerName: string): void {
    form.controls[controllerName].enable();
  }

  disableFormField(form: FormGroup, controllerName: string): void {
    form.controls[controllerName].disable();
  }

  getExportType(exportType: string | null): string {
    return exportType ? new SnakeCaseToSpaceCasePipe().transform(new TitleCasePipe().transform(exportType)): 'expense';
  }

  setOrClearValidators(selectedValue: string, value: string[], form: FormGroup): void {
    if (selectedValue) {
      value.forEach((controllerName: string) => {
        this.markControllerAsRequired(form, controllerName);
        const urlSplit = this.router.url.split('/');
        if (urlSplit[2] === AppUrl.SAGE300 && (controllerName === 'cccExportType' || controllerName === 'reimbursableExportType')) {
          this.setSage300ExportTypeControllerValue(form, controllerName);
        } else if (urlSplit[2] === AppUrl.XERO && (controllerName === 'creditCardExportType' || controllerName === 'reimbursableExportType')) {
          this.setXeroExportTypeControllerValue(form, controllerName);
        }
      });
    } else {
      value.forEach((controllerName: string) => {
        this.clearValidatorAndResetValue(form, controllerName);
      });
    }
  }

  setConfigurationSettingValidatorsAndWatchers(validatorRule: ExportSettingValidatorRule | SkipExportValidatorRule, form: FormGroup) {
    const keys = Object.keys(validatorRule);
    Object.values(validatorRule).forEach((value, index) => {
      form.controls[keys[index]].valueChanges.subscribe((selectedValue) => {
        this.setOrClearValidators(selectedValue, value, form);
      });
    });
  }

  setExportTypeValidatorsAndWatchers(exportTypeValidatorRule: ExportModuleRule[], form: FormGroup, commonFormFields: string[] | void): void {
    Object.values(exportTypeValidatorRule).forEach((values) => {
      form.controls[values.formController].valueChanges.subscribe((isSelected) => {
        const urlSplit = this.router.url.split('/');
        if (urlSplit[2] === AppUrl.BUSINESS_CENTRAL && values.formController === 'reimbursableExportType' && isSelected === BusinessCentralExportType.PURCHASE_INVOICE) {
          form.controls.reimbursableEmployeeMapping.patchValue(FyleField.VENDOR);
        }
        Object.entries(values.requiredValue).forEach(([key, value]) => {
          if (key === isSelected) {
            value.forEach((element: any) => {
              this.markControllerAsRequired(form, element);
            });
          } else {
            value.forEach((element: any) => {
              this.clearValidatorAndResetValue(form, element, commonFormFields);
            });
          }
        });
      });
    });
  }

  exportSelectionValidator(exportSettingForm: FormGroup): ValidatorFn {
    return (control: AbstractControl): {[key: string]: object} | null => {
      let forbidden = true;
      if (exportSettingForm) {
        if (typeof control.value === 'boolean') {
          if (control.value) {
            forbidden = false;
          } else {
            if (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value) {
              forbidden = false;
            }
          }
        } else if ((control.value === ExpenseState.PAID || control.value === ExpenseState.PAYMENT_PROCESSING) && (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value)) {
          forbidden = false;
        }
        if (!forbidden) {
          control.parent?.get('reimbursableExpense')?.setErrors(null);
          control.parent?.get('creditCardExpense')?.setErrors(null);
          return null;
        }
      }
      return {
        forbiddenOption: {
          value: control.value
        }
      };
    };
  }

  getPhase(isOnboarding: boolean): ProgressPhase {
    return isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  resetForm(form: FormGroup): void {
    form.reset();
  }

  handleSkipExportFormInAdvancedSettingsUpdates(skipExportForm: FormGroup, fields: skipExportValidator, advancedSettingForm: FormGroup): void {
    advancedSettingForm.controls.skipExport.valueChanges.subscribe((isChanged) => {
      if (isChanged) {
        fields.isChanged.forEach((value: string) => {
          this.markControllerAsRequired(skipExportForm, value);
        });
      } else {
        fields.isNotChanged.forEach((value: string) => {
          this.clearValidatorAndResetValue(skipExportForm, value);
        });
      }
    });
  }

  handleSkipExportFormUpdates(skipExportForm: FormGroup, fields: string[], isChanged: boolean): void {
    if (isChanged) {
      fields.forEach((value: string) => {
        this.markControllerAsRequired(skipExportForm, value);
      });
    } else {
      fields.forEach((value: string) => {
        this.clearValidatorAndResetValue(skipExportForm, value);
      });
    }
  }

  oauthHandler(url: string): void {
    const popup = window.open(url);

    const activePopup = setInterval(() => {
      if (popup?.location?.href?.includes('code')) {
        const callbackURL = popup?.location.href;
        this.oauthCallbackUrl.emit(callbackURL);

        popup.close();
      } else if (!popup || !popup.closed) {
        return;
      }

      clearInterval(activePopup);
    }, 500);
  }

  addExportSettingFormValidator(form: FormGroup): void {
    form.controls.reimbursableExpense.setValidators(this.exportSelectionValidator(form));
    form.controls.creditCardExpense.setValidators(this.exportSelectionValidator(form));
  }

  sentenseCaseConversion(content: string) {
    content = new SnakeCaseToSpaceCasePipe().transform(content);
    return brandingConfig.brandId === 'co' ? new SentenceCasePipe().transform(content) : content;
  }

}
