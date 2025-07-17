import { Component, EventEmitter, Input, Output } from '@angular/core';
import { brandingFeatureConfig } from "src/app/branding/branding-config";

@Component({
  selector: 'app-outlined-icon-button',
  templateUrl: './outlined-icon-button.component.html',
  styleUrl: './outlined-icon-button.component.scss'
})
export class OutlinedIconButtonComponent {
  @Input() buttonText: string = '';

  @Input() svgSource: string;

  @Input() disabled: boolean | undefined;

  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  readonly brandingFeatureConfig = brandingFeatureConfig;

  onClick(): void {
    this.buttonClick.emit();
  }
}