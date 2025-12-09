import { Component, Input } from '@angular/core';
import { brandingStyle } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-configuration-field-container',
  templateUrl: './configuration-field-container.component.html',
  styleUrl: './configuration-field-container.component.scss',
  standalone: false,
})
export class ConfigurationFieldContainerComponent {
  readonly brandingStyle = brandingStyle;

  @Input() isMandatory = false;

  @Input({ required: true }) label: string;

  @Input({ required: true }) subLabel: string;

  @Input() iconPath: string;

  @Input() hint: string;
}
