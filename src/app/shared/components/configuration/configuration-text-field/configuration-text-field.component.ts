import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingConfig, brandingStyle } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-configuration-text-field',
  templateUrl: './configuration-text-field.component.html',
  styleUrls: ['./configuration-text-field.component.scss']
})
export class ConfigurationTextFieldComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() label: string;

  @Input() formControllerName: string;

  @Input() placeholder: string;

  @Input() isFieldMandatory: boolean;

  @Input() customErrorMessage: string;

  @Input() type: string = 'text';

  @Input() styleClasses?: string;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  isPasswordField: any;

  constructor() { }

  changeFormControllerType(state: boolean) {
    this.type = state ? 'text' : 'password';
  }

  ngOnInit(): void {
    this.isPasswordField = this.type === 'password' ? true : false;
  }

}
