import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';

@Component({
    selector: 'app-intacct-connection-form',
    templateUrl: './intacct-connection-form.component.html',
    styleUrl: './intacct-connection-form.component.scss',
    standalone: false
})
export class IntacctConnectionFormComponent {

  @Input() connectIntacctForm: FormGroup;

  @Input() isReconnecting?: boolean;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

  constructor(){

  }
}