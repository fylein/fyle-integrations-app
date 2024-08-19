import { Component, Input } from '@angular/core';
import { SizeOption, ThemeOption } from 'src/app/core/models/enum/enum.model';


@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {
  @Input() size: SizeOption = SizeOption.DEFAULT;

  @Input() theme: ThemeOption = ThemeOption.DARK;

  @Input() text: string = '';

  get dynamicClassNames() {
    return `size-${this.size} theme-${this.theme}`;
  }
}