import { Component, OnInit } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { ConfigurationCta, RedirectLink } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-configuration-export-settings',
  templateUrl: './configuration-export-settings.component.html',
  styleUrls: ['./configuration-export-settings.component.scss']
})
export class ConfigurationExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  exportSettingsForm: FormGroup;

  RedirectLink = RedirectLink;

  isOnboarding: boolean = true;

  saveInProgress: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  constructor() { }

  ngOnInit(): void {
  }

}
