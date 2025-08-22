import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { MainMenuDropdownGroup } from 'src/app/core/models/misc/main-menu-dropdown-options';

@Component({
  selector: 'app-split-menu-button',
  templateUrl: './split-menu-button.component.html',
  styleUrl: './split-menu-button.component.scss'
})
export class SplitMenuButtonComponent {

  @Input() buttonText: string = '';

  @Input() dropdownOptions: MainMenuDropdownGroup[];

  @Input() currentIntegration?: string;

  @Input() isDisconnectRequired?: boolean;

  isDropdownVisible: boolean = false;

  toggleDropdown(event: MouseEvent): void {
    this.isDropdownVisible = !this.isDropdownVisible;
    event.stopPropagation();
  }

  @ViewChild('dropdownRef', { static: false }) dropdownElement!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isDropdownVisible && this.dropdownElement &&
        !this.dropdownElement.nativeElement.contains(event.target)) {
      this.isDropdownVisible = false;
    }
  }

  handleOptionClick(option: { handler?: () => void; disabled?: boolean; label?: string }): void {
    // Don't handle click if this is the current integration (read-only)
    if (this.isCurrentIntegrationItem(option.label)) {
      return;
    }

    if (option.handler && !option.disabled) {
      option.handler();
      this.isDropdownVisible = false;
    }
  }

  isCurrentIntegrationItem(optionLabel?: string): boolean {
    return this.currentIntegration !== undefined &&
           optionLabel !== undefined &&
           optionLabel === this.currentIntegration;
  }

  setItemClasses(isFirst: boolean, isLast: boolean): string {
    const baseClasses = [];
    if (isFirst) {
      baseClasses.push('tw-rounded-tr-lg tw-rounded-tl-lg');
    }
    if (isLast) {
      baseClasses.push('tw-rounded-br-lg tw-rounded-bl-lg');
    }

    if (isLast && this.isDisconnectRequired) {
      baseClasses.push('hover:tw-bg-bg-red hover:tw-text-white tw-text-text-red');
    }

    return baseClasses.join(' ');
  }

}
