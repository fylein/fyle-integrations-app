import { Component, Input, OnInit } from '@angular/core';
import type { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent {

  @Input() form: FormGroup;

  @Input() formControllerName: string;

  @Input() isDisabled: boolean;

  constructor() { }

}
