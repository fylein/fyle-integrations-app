import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { brandingConfig, brandingStyle } from 'src/app/branding/branding-config';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-configuration-multi-select',
    templateUrl: './configuration-multi-select.component.html',
    styleUrls: ['./configuration-multi-select.component.scss'],
    standalone: false
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

  @Input() maxSelections: number;

  @Input() selectionLimitExceededTooltipText: string;

  @Output() changeInMultiSelect = new EventEmitter();

  currentlyDragging: string | null;

  selected: any[];

  startIndex: number;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private translocoService: TranslocoService
  ) { }

  onMultiSelectChange() {
    const selectedValues = this.form.get(this.formControllerName)?.value;

    if (selectedValues && selectedValues.length > 0) {
      const optionsCopy = [...this.options];

      const sortedValues = [...selectedValues].sort((a, b) => {
        return optionsCopy.indexOf(a) - optionsCopy.indexOf(b);
      });

      this.form.get(this.formControllerName)?.setValue(sortedValues, { emitEvent: false });
    }

    this.changeInMultiSelect.emit();
  }

  getMemo(memo: string): string {
    if (memo === 'expense_key') {
      return this.translocoService.translate('configurationMultiSelect.expenseReportId');
    } else if (memo === 'card_number') {
      return this.translocoService.translate('configurationMultiSelect.cardNumber');
    } else if (memo === 'spent_at' || memo === 'spent_on') {
      return this.translocoService.translate('configurationMultiSelect.spentAt');
    } else if (memo === 'merchant' && this.options.includes('card_merchant')) {
      return this.translocoService.translate('configurationMultiSelect.merchant');
    } else if (memo === 'card_merchant') {
      return this.translocoService.translate('configurationMultiSelect.cardMerchant');
    }

    return new SnakeCaseToSpaceCasePipe().transform(new SentenceCasePipe(this.translocoService).transform(memo));
  }

  getOptionTooltip(item: string): string | undefined {
    // If selection limit is reached, show tooltip on the disabled (not selected) options
    const selectedOptions = this.form.get(this.formControllerName)?.value;
    const isOptionSelected = selectedOptions.includes(item);
    if (this.maxSelections && selectedOptions.length >= this.maxSelections && !isOptionSelected) {
      return this.selectionLimitExceededTooltipText;
    }
    return undefined;
  }

  // Helper to join selected item labels into a single string for template rendering
  getSelectedItemsText(value: string[] | null | undefined): string {
    if (!value || value.length === 0) {
      return '';
    }
    return value.map((name: string) => this.getMemo(name)).join(', ');
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
