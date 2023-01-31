import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QBDConfigurationCtaText } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-export-setting',
  templateUrl: './export-setting.component.html',
  styleUrls: ['./export-setting.component.scss']
})
export class ExportSettingComponent implements OnInit {

  isLoading: boolean = true;

  saveInProgress: boolean = false;

  isOnboarding: boolean = true;

  exportSettingsForm: FormGroup;

  ConfigurationCtaText = QBDConfigurationCtaText;

  constructor(
    private router: Router
  ) { }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
  }

  save(): void {

  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
