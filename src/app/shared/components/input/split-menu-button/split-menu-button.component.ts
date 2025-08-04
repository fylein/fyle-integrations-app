import { Component, EventEmitter, Input, Output } from '@angular/core';
import { brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-split-menu-button',
  templateUrl: './split-menu-button.component.html',
  styleUrl: './split-menu-button.component.scss'
})
export class SplitMenuButtonComponent {

  @Input() buttonText: string = '';

  @Input() svgSource: string;

  @Input() disabled: boolean | undefined;

  @Input() isIconLeftSide?: boolean;

  @Input() styleClasses?: string = '';

  @Input() iconSize?: string;

  @Input() isLoading?: boolean;

  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  iconColor: string = brandingStyle.buttons.primary.iconColorActive;

  onClick(): void {
    if (!this.disabled && !this.isLoading){
    this.buttonClick.emit();
    }
  }

  onHover(onHover: boolean){
    if (onHover){
      this.iconColor = brandingStyle.buttons.primary.iconColorHover;
    } else {
      this.iconColor = brandingStyle.buttons.primary.iconColorActive;
    }
  }


}
