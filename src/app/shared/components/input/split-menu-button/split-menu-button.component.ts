import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Dropdown } from 'primeng/dropdown';
import { brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { MainMenuDropdownGroup } from 'src/app/core/models/misc/main-menu-dropdown-options';

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

  @Input() dropdownOptions: MainMenuDropdownGroup[];

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

  menuOptions = [
    { label: 'Menu button label 1', value: 1 },
    { label: 'Menu button label 2', value: 2 },
    { label: 'Menu button label 3', value: 3 }
  ];

  toggleDropdown(event: MouseEvent, dropdown: any): void {
  if (dropdown.overlayVisible) {
    dropdown.hide();
  } else {
    dropdown.show(event); // Must pass the click event
  }

  }

  @ViewChild('buttonWrapper', { static: false }) buttonWrapper!: ElementRef;

  showDropdownFromElement(dropdown: any, elementRef: ElementRef) {
  const rect = elementRef.nativeElement.getBoundingClientRect();

  const fakeEvent = {
    currentTarget: {
      getBoundingClientRect: () => ({
        top: rect.bottom + 8,  // 8px gap below
        left: rect.right - 160, // Align to right, fallback fits by PrimeNG
        width: 0,
        height: 0
      })
    },
    target: elementRef.nativeElement,
    preventDefault: () => {},
    stopPropagation: () => {}
  };

  if (dropdown.overlayVisible) {
    dropdown.hide();
  } else {
    dropdown.show(fakeEvent as unknown as MouseEvent);
  }
}
}
