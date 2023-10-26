import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { AppUrlMap } from '../../models/integrations/integrations.model';
import { AppUrl, ExpenseState } from '../../models/enum/enum.model';
import { AbstractControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ValidatorRule } from '../../models/sage300/sage300-configuration/sage300-export-setting.model';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  setBaseApiURL(): void {
    const urlSplit = this.router.url.split('/');
    const module:AppUrl = (urlSplit.length > 2 ? urlSplit[2] : urlSplit[1]) as AppUrl;
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

  setCustomValidatorsAndWatchers(validatorRule: ValidatorRule, form: FormGroup) {
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
}
