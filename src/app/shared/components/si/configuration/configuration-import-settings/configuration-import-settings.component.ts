import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfigurationCta, RedirectLink } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-configuration-import-settings',
  templateUrl: './configuration-import-settings.component.html',
  styleUrls: ['./configuration-import-settings.component.scss']
})
export class ConfigurationImportSettingsComponent implements OnInit {

  isLoading: boolean = false;

  importSettingsForm: FormGroup;

  RedirectLink = RedirectLink;

  saveInProgress: boolean = false;

  isOnboarding: boolean;

  ConfigurationCtaText = ConfigurationCta;

  constructor() { }

  ngOnInit(): void {
  }

}
