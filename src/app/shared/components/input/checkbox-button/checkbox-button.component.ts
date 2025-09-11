import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { brandingConfig, brandingStyle } from 'src/app/branding/branding-config';
import { CheckBoxUpdate } from 'src/app/core/models/common/helper.model';

@Component({
  selector: 'app-checkbox-button',
  standalone: true,
  imports: [ButtonModule, CommonModule, FormsModule],
  templateUrl: './checkbox-button.component.html',
  styleUrl: './checkbox-button.component.scss'
})
export class CheckboxButtonComponent {

  @Input({required: true}) unCheckedText: string;

  @Input({required: true}) checkedText: string;

  @Input({required: true}) id: number;

  @Output() checkBoxUpdated: EventEmitter<CheckBoxUpdate> = new EventEmitter();

  isCheckboxSelected: boolean = false;

  brandingConfig = brandingConfig;

  brandingStyle = brandingStyle;

  onCheckBoxClick() {
    this.isCheckboxSelected = !this.isCheckboxSelected;
    this.checkBoxUpdated.emit({id: this.id, value: this.isCheckboxSelected});
  }
}
