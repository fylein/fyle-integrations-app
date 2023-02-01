import { Component, Input, OnInit } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-configuration-toggle-field',
  templateUrl: './configuration-toggle-field.component.html',
  styleUrls: ['./configuration-toggle-field.component.scss']
})
export class ConfigurationToggleFieldComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() formControllerName: string;

  @Input() label: string;

  @Input() subLabel: string;

  checked = true;

  constructor() { }

  ngOnInit(): void {
  }

}
