import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
    selector: 'app-sage300-connection-form',
    templateUrl: './sage300-connection-form.component.html',
    styleUrl: './sage300-connection-form.component.scss',
    standalone: false
})
export class Sage300ConnectionFormComponent {

  @Input() connectSage300Form: FormGroup;

  @Input() isReconnecting?: boolean;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(){

  }
}