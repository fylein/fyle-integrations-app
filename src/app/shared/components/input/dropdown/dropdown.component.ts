import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {

  @Input() options: any[];

  @Input() placeholder: string;

  @Input() form: FormGroup;

  @Input() formControllerName: string;

  @Input() displayKey: string;

  constructor() { }

}
