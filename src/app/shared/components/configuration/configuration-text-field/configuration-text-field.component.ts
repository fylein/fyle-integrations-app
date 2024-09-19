import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import { brandingConfig } from 'src/app/branding/branding-config';

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

  readonly brandingConfig = brandingConfig;

  isPasswordField: any;

  constructor() { }

  changeFormControllerType(state: boolean) {
    this.type = state ? 'text' : 'password';
  }

  ngOnInit(): void {
    this.isPasswordField = this.type === 'password' ? true : false;
  }

}
