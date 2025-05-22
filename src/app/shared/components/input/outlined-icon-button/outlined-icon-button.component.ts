import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-outlined-icon-button',
  templateUrl: './outlined-icon-button.component.html',
  styleUrl: './outlined-icon-button.component.scss'
})
export class OutlinedIconButtonComponent {
  @Input() buttonText: string = '';

  @Input() svgSource: string;

  @Input() disabled: boolean;

  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}