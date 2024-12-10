import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { brandingConfig } from 'src/app/branding/branding-config';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
  selector: 'app-configuration-multi-select',
  templateUrl: './configuration-multi-select.component.html',
  styleUrls: ['./configuration-multi-select.component.scss']
})
export class ConfigurationMultiSelectComponent implements OnInit {

  @Input() options: string[];

  @Input() form: FormGroup;

  @Input() iconPath: string;

  @Input() label: string;

  @Input() subLabel: string;

  @Input() placeholder: string;

  @Input() formControllerName: string;

  @Input() isFieldMandatory: boolean;

  @Input() mandatoryErrorListName: string;

  @Input() customErrorMessage: string;

  @Input() isCloneSettingView: boolean;

  @Output() changeInMultiSelect = new EventEmitter();

  currentlyDragging: string | null;

  selected: any[];

  startIndex: number;

  readonly brandingConfig = brandingConfig;

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder
  ) { }

  onMultiSelectChange() {
    this.changeInMultiSelect.emit();
  }

  getMemo(memo: string): string {
    return memo === 'expense_key' ? 'Expense/Report Id' : new SnakeCaseToSpaceCasePipe().transform(new TitleCasePipe().transform(memo));
  }

//   DragStart(memo: string) {
//     This.currentlyDragging = memo;
// }
// // On Drag End
// DragEnd() {
//     This.currentlyDragging = null;
// }

// // On Drop of Item to droppable area
// Drop() {
//     If (this.currentlyDragging) {
//         Let currentlyDraggingIndex = this.options.indexOf(this.currentlyDragging)
//         This.selected =
//             [...this.selected, this.currentlyDragging];
//         This.options =
//             This.options.filter((val, i) => i !=
//                 CurrentlyDraggingIndex);
//         This.currentlyDragging = null;
//     }
// }
// OnDragStart(index: number) {
//   This.startIndex = index;
// }

// OnDrop(dropIndex: number) {
//   Const general = this.options[this.startIndex]; // get element
//   This.options.splice(this.startIndex, 1);       // delete from old position
//   This.options.splice(dropIndex, 0, general);    // add to new position
// }
  ngOnInit(): void {
  }

}
