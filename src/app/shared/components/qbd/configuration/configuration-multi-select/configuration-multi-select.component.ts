import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  currentlyDragging: string | null;

  selected: any[];

  constructor(
    private formBuilder: FormBuilder
  ) { }

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
  ngOnInit(): void {
  }

}
