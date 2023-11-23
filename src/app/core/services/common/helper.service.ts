import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { AppUrlMap } from '../../models/integrations/integrations.model';
import { AppUrl, ExpenseState, ProgressPhase } from '../../models/enum/enum.model';
import { AbstractControl, FormArray, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ExportModuleRule, ExportSettingValidatorRule } from '../../models/sage300/sage300-configuration/sage300-export-setting.model';
import { TitleCasePipe } from '@angular/common';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { AdvancedSettingValidatorRule } from '../../models/sage300/sage300-configuration/sage300-advanced-settings.model';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  setBaseApiURL(appUrl: string| void): void {
    console.log(appUrl)
    const urlSplit = this.router.url.split('/');
    let module: AppUrl;

    if (appUrl) {
      // Condition 1: If appUrl is truthy, use it as AppUrl
      module = appUrl as AppUrl;
    } else {
      // Condition 2: If appUrl is falsy, determine module based on urlSplit length
      module = (urlSplit.length > 2 ? urlSplit[2] : urlSplit[1]) as AppUrl;
    }

    // Use a default value if module is still falsy
    module = module || AppUrl.INTEGRATION;
    console.log('cdcd',module)
    const apiUrlMap: AppUrlMap = {
      [AppUrl.INTACCT]: environment.si_api_url,
      [AppUrl.QBD]: environment.qbd_api_url,
      [AppUrl.TRAVELPERK]: environment.api_url,
      [AppUrl.BAMBOO_HR]: environment.api_url,
      [AppUrl.GUSTO]: environment.api_url,
      [AppUrl.SAGE300]: environment.sage300_api_url,
      [AppUrl.INTEGRATION]: environment.api_url
    };

    this.apiService.setBaseApiURL(apiUrlMap[module]);
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

  handleSkipExportFormUpdates(skipExportForm: FormGroup, fields: string[], isChanged: boolean): void {
    if (isChanged) {
      fields.forEach((value) => {
        this.markControllerAsRequired(skipExportForm, value);
      });
    } else {
      fields.forEach((value) => {
        this.clearValidatorAndResetValue(skipExportForm, value);
      });
    }
  }
}

