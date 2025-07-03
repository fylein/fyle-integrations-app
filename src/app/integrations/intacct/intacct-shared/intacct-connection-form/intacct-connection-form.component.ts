import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-intacct-connection-form',
  templateUrl: './intacct-connection-form.component.html',
  styleUrl: './intacct-connection-form.component.scss'
})
export class IntacctConnectionFormComponent {

  @Input() connectIntacctForm: FormGroup;

  @Input() isReconnecting?: boolean;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(){

  }
}