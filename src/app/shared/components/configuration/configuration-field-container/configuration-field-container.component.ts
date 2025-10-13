import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-configuration-field-container',
  templateUrl: './configuration-field-container.component.html',
  styleUrl: './configuration-field-container.component.scss'
})
export class ConfigurationFieldContainerComponent {

  @Input() isMandatory = false;

  @Input({ required: true }) label: string;

  @Input({ required: true }) subLabel: string;

  @Input() iconPath: string;

  @Input() hint: string;

}
