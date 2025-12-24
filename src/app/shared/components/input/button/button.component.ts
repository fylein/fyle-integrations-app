import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { ButtonSize, ButtonType } from 'src/app/core/models/enum/enum.model';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    standalone: false
})
export class ButtonComponent implements OnInit{
  @Input() buttonText: string = '';

  @Input() buttonSize: ButtonSize;

  @Input() buttonType: ButtonType;

  @Input() svgSource: string;

  @Input() disabled: boolean | undefined;

  @Input() isIconLeftSide?: boolean;

  @Input() styleClasses?: string = '';

  @Input() iconSize?: string;

  @Input() iconViewbox: string;

  @Input() isLoading?: boolean;

  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  iconColor: string;

  ButtonSize = ButtonSize;

  onClick(): void {
    if (!this.disabled && !this.isLoading){
    this.buttonClick.emit();
    }
  }

  ngOnInit(): void {
    this.iconColor = brandingStyle.buttons[this.buttonType].iconColorActive;
  }

}
