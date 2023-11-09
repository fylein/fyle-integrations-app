import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { Sage300AdvancedSettingGet, Sage300AdvancedSettingModel } from 'src/app/core/models/sage300/sage300-configuration/sage300-advanced-settings.mode';
import { Sage300AdvancedSettingsService } from 'src/app/core/services/sage300/sage300-configuration/sage300-advanced-settings.service';
import { ConditionField, EmailOption, ExpenseFilterResponse } from '/Users/fyle/integrations/fyle-integrations-settings-app/src/app/core/models/common/advanced-settings.model';

@Component({
  selector: 'app-sage300-advanced-settings',
  templateUrl: './sage300-advanced-settings.component.html',
  styleUrls: ['./sage300-advanced-settings.component.scss']
})
export class Sage300AdvancedSettingsComponent implements OnInit {
  isLoading: boolean = true;

  advancedSetting: Sage300AdvancedSettingGet | null;

  adminEmails: EmailOption[];

  expenseFilters: ExpenseFilterResponse[];

  conditionFieldOptions: ConditionField[];

  advancedSettingForm: FormGroup;

  constructor(
    private advancedSettingsService: Sage300AdvancedSettingsService
  ) { }

  private getSettingsAndSetupForm(): void {
    forkJoin([
      this.advancedSettingsService.getAdvancedSettings().pipe(catchError(() => of(null))),
      this.advancedSettingsService.getAdminEmail(),
      this.advancedSettingsService.getExpenseFilter(),
      this.advancedSettingsService.getExpenseFilelds()
    ]).subscribe((responses) => {
      this.advancedSetting = responses[0];
      this.adminEmails = responses[1];
      this.expenseFilters = responses[2].results;
      this.conditionFieldOptions = responses[3];
      this.advancedSettingForm = Sage300AdvancedSettingModel.mapAPIResponseToFormGroup(this.advancedSetting);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
