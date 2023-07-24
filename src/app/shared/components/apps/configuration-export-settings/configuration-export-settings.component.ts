import { Component, OnInit } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { ConfigurationCta, RedirectLink } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-configuration-export-settings',
  templateUrl: './configuration-export-settings.component.html',
  styleUrls: ['./configuration-export-settings.component.scss']
})
export class ConfigurationExportSettingsComponent implements OnInit {

  exportSettingsForm: FormGroup;

  RedirectLink = RedirectLink;

  ConfigurationCtaText = ConfigurationCta;

  isOnboarding: boolean = true;

  saveInProgress: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
