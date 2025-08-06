import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Dropdown } from 'primeng/dropdown';
import { brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { InAppIntegration } from 'src/app/core/models/enum/enum.model';
import { MainMenuDropdownGroup } from 'src/app/core/models/misc/main-menu-dropdown-options';
import { IntegrationsService } from 'src/app/core/services/common/integrations.service';

@Component({
  selector: 'app-split-menu-button',
  templateUrl: './split-menu-button.component.html',
  styleUrl: './split-menu-button.component.scss'
})
export class SplitMenuButtonComponent {

  @Input() buttonText: string = '';

  @Input() dropdownOptions: MainMenuDropdownGroup[];

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

  handleOptionClick(option: { handler?: () => void; disabled?: boolean }): void {
    if (option.handler && !option.disabled) {
      option.handler();
      this.isDropdownVisible = false;
    }
  }

  setLastItemClasses(isLast: boolean): string {
    const baseClasses = [];
    if (isLast) {
      baseClasses.push('tw-rounded-br-lg tw-rounded-bl-lg');
    }

    return baseClasses.join(' ');
  }

}
