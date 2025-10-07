import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage50ImportSettingsForm } from 'src/app/core/models/sage50/sage50-configuration/sage50-import-settings.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sage50-import-settings',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './sage50-import-settings.component.html',
  styleUrl: './sage50-import-settings.component.scss'
})
export class Sage50ImportSettingsComponent {

  // Constants
  readonly appName = AppName.SAGE50;

  readonly brandingStyle = brandingStyle;

  readonly redirectLink = brandingKbArticles.onboardingArticles.SAGE50.IMPORT_SETTINGS;

  readonly brandingConfig = brandingConfig;

  // Flags
  isLoading: boolean;

  // Form
  importSettingsForm: FormGroup<Sage50ImportSettingsForm>;

}
