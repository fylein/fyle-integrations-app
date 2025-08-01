import { Component, EventEmitter, Input, Output } from '@angular/core';
import { brandingStyle } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-outlined-icon-button',
  templateUrl: './outlined-icon-button.component.html',
  styleUrl: './outlined-icon-button.component.scss'
})
export class OutlinedIconButtonComponent {
  @Input() buttonText: string = '';

  @Input() svgSource: string;

  @Input() disabled: boolean | undefined;

  @Input() isIconLeftSide?: boolean;

  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  readonly brandingStyle = brandingStyle;

  iconColor: string = brandingStyle.buttons.outlined.iconColorActive;

  onClick(): void {
    this.buttonClick.emit();
  }

  onHover(onHover: boolean){
    if (onHover){
      this.iconColor = brandingStyle.buttons.outlined.iconColorHover;
    } else {
      this.iconColor = brandingStyle.buttons.outlined.iconColorActive;
    }
  }
}