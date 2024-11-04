import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { brandingConfig } from 'src/app/branding/branding-config';
import { checkBoxEmit } from 'src/app/core/models/common/helper.model';

@Component({
  selector: 'app-chechbox-button',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  templateUrl: './chechbox-button.component.html',
  styleUrl: './chechbox-button.component.scss'
})
export class ChechboxButtonComponent {

  @Input() unCheckedText: string;

  @Input() checkedText: string;

  @Input() id: number;

  @Output() checkBoxUpdated: EventEmitter<checkBoxEmit> = new EventEmitter();

  isCheckboxSelected: boolean = false;

  brandingConfig = brandingConfig;

  onCheckBoxClick(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.isCheckboxSelected = inputElement.checked;
    this.checkBoxUpdated.emit({id: this.id, value: this.isCheckboxSelected});
  }
}
