import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {

  /**
   * The options that the dropdown will display. Each option should
   * contain an object with keys corresponding to `displayKey`.
   */
  @Input() options: any[];

  /**
   * The placeholder text to display when no option is selected.
   */
  @Input() placeholder: string;

  /**
   * The form group that this dropdown is a part of.
   */
  @Input() form: FormGroup = new FormGroup({number: new FormControl(3)});

  /**
   * The name of the form control within the FormGroup that this
   * dropdown is associated with.
   */
  @Input() formControllerName: string;

  /**
   * The key in the option objects used to display the text in the
   * dropdown options.
   */
  @Input() displayKey: string;

  @Input() isDisabled: boolean;

  @Input() additionalClasses: string;

  @Input() isMultiLineOption: boolean;

  constructor() { }

}
