import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'app-toggle',
    templateUrl: './toggle.component.html',
    styleUrls: ['./toggle.component.scss'],
    standalone: false
})
export class ToggleComponent {

  @Input() form: FormGroup;

  @Input() formControllerName: string;

  @Input() isDisabled: boolean;

  @Output() changed = new EventEmitter<boolean>();

  constructor() { }

}
