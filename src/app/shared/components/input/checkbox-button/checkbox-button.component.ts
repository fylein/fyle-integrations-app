import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { brandingConfig } from 'src/app/branding/branding-config';
import { CheckBoxUpdate } from 'src/app/core/models/common/helper.model';

@Component({
  selector: 'app-checkbox-button',
  standalone: true,
  imports: [ButtonModule, CommonModule],
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

  onCheckBoxClick(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.isCheckboxSelected = inputElement.checked;
    this.checkBoxUpdated.emit({id: this.id, value: this.isCheckboxSelected});
  }
}
