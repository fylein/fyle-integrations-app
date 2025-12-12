import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-multi-select',
    templateUrl: './multi-select.component.html',
    styleUrls: ['./multi-select.component.scss'],
    standalone: false
})
export class MultiSelectComponent {

  @Input() form: FormGroup;

  @Input() formControllerName: string;

  @Input() disabledOption: string;

  @Input() placeholder: string;

  @Input() options: any[];

  constructor() { }

}
