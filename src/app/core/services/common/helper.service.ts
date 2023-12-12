import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { AppUrlMap } from '../../models/integrations/integrations.model';
import { AppUrl, ExpenseState, ProgressPhase, Sage300ExportType } from '../../models/enum/enum.model';
import { AbstractControl, FormArray, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ExportModuleRule, ExportSettingValidatorRule } from '../../models/sage300/sage300-configuration/sage300-export-setting.model';
import { TitleCasePipe } from '@angular/common';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { AdvancedSettingValidatorRule, skipExportValidator } from '../../models/common/advanced-settings.model';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  @Output() oauthCallbackUrl: EventEmitter<string> = new EventEmitter();

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

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
      [AppUrl.INTACCT]: environment.si_api_url,
      [AppUrl.QBD]: environment.qbd_api_url,
      [AppUrl.TRAVELPERK]: environment.api_url,
      [AppUrl.BAMBOO_HR]: environment.api_url,
      [AppUrl.GUSTO]: environment.api_url,
      [AppUrl.SAGE300]: environment.sage300_api_url,
      [AppUrl.INTEGRATION]: environment.api_url,
      [AppUrl.BUSINESS_CENTRAL]: environment.business_central_api_url,
      [AppUrl.QBO]: environment.qbo_api_url
    };

    const apiUrl = apiUrlMap[module] ?? apiUrlMap.integration;
    this.apiService.setBaseApiURL(apiUrl);
  }

  getAppName(): string {
    const appName = this.router.url.split('/')[2];
    return appName;
  }

  markControllerAsRequired(form: FormGroup, controllerName: string): void {
    form.controls[controllerName].setValidators(Validators.required);
  }

  clearValidatorAndResetValue(form: FormGroup, controllerName: string): void {
    form.controls[controllerName].clearValidators();
    form.controls[controllerName].setValue(null);
  }

  setSage300ExportTypeControllerValue(form: FormGroup, controllerName: string): void {
    form.controls[controllerName].setValue(Sage300ExportType.PURCHASE_INVOICE);
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

  setConfigurationSettingValidatorsAndWatchers(validatorRule: ExportSettingValidatorRule | AdvancedSettingValidatorRule, form: FormGroup) {
    const keys = Object.keys(validatorRule);
    Object.values(validatorRule).forEach((value, index) => {
      form.controls[keys[index]].valueChanges.subscribe((isSelected) => {
        if (isSelected) {
          value.forEach((element: string) => {
            this.markControllerAsRequired(form, element);
            const urlSplit = this.router.url.split('/');
            if (urlSplit[2] === AppUrl.SAGE300 && (element === 'cccExportType' || element === 'reimbursableExportType')) {
              this.setSage300ExportTypeControllerValue(form, element);
            }
          });
        } else {
          value.forEach((element: string) => {
            this.clearValidatorAndResetValue(form, element);
          });
        }
      });
    });
  }

  setExportTypeValidatoresAndWatchers(exportTypeValidatorRule: ExportModuleRule[], form: FormGroup): void {
    Object.values(exportTypeValidatorRule).forEach((values) => {
      form.controls[values.formController].valueChanges.subscribe((isSelected) => {
        Object.entries(values.requiredValue).forEach(([key, value]) => {
          if (key === isSelected) {
            value.forEach((element: any) => {
              this.markControllerAsRequired(form, element);
            });
          } else {
            value.forEach((element: any) => {
              this.clearValidatorAndResetValue(form, element);
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
    const popup = window.open(url, 'popup', 'popup=true, width=500, height=800, left=500');

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

  formatMemoPreview(memoStructure: string[], defaultMemoOptions: string[]): string {
    const time = Date.now();
    const today = new Date(time);

    const previewValues: { [key: string]: string } = {
      employee_email: 'john.doe@acme.com',
      category: 'Meals and Entertainment',
      purpose: 'Client Meeting',
      merchant: 'Pizza Hut',
      report_number: 'C/2021/12/R/1',
      spent_on: today.toLocaleDateString(),
      expense_link: `${environment.fyle_app_url}/app/main/#/enterprise/view_expense/`
    };
    let memoPreviewText = '';
    const memo: string[] = [];
    memoStructure.forEach((field, index) => {
      if (field in previewValues) {
        const defaultIndex = defaultMemoOptions.indexOf(memoStructure[index]);
        memo[defaultIndex] = previewValues[field];
      }
    });
    memo.forEach((field, index) => {
      memoPreviewText += field;
      if (index + 1 !== memo.length) {
        memoPreviewText = memoPreviewText + ' - ';
      }
    });
    return memoPreviewText;
  }

}

