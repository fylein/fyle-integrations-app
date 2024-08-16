import { Component, Input } from '@angular/core';


type SizeOption = 'default' | 'large';
type ThemeOption = 'brand' | 'light' | 'dark';


@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {
  @Input() size: SizeOption = 'default';

  @Input() theme: ThemeOption = 'dark';

  @Input() text: string = '';

  get dynamicClassNames() {
    return `size-${this.size} theme-${this.theme}`;
  }
}