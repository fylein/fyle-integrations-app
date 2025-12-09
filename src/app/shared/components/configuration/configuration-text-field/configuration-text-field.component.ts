import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingConfig, brandingStyle } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-configuration-text-field',
  templateUrl: './configuration-text-field.component.html',
  styleUrls: ['./configuration-text-field.component.scss'],
  standalone: false,
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

  @Input() expanded = false;

  @Input() iconPath: string;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  isPasswordField: boolean = false;

  isPasswordVisible: boolean = false;

  constructor() {}

  changeFormControllerType(showPassword: boolean) {
    this.isPasswordVisible = showPassword;
    this.type = showPassword ? 'text' : 'password';
  }

  ngOnInit(): void {
    this.isPasswordField = this.type === 'password';
    this.isPasswordVisible = false;
  }
}
