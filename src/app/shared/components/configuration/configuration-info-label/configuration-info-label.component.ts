import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingStyle } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-configuration-info-label',
  templateUrl: './configuration-info-label.component.html',
  styleUrls: ['./configuration-info-label.component.scss'],
  standalone: false,
})
export class ConfigurationInfoLabelComponent implements OnInit {
  @Input() infoText: string;

  @Input() showIcon: boolean = true;

  @Input() showCloseIcon: boolean = false;

  @Input() customClasses: string = '';

  @Output() closeInfoLabel = new EventEmitter<boolean>();

  readonly brandingStyle = brandingStyle;

  constructor() {}

  clearSearch() {
    this.closeInfoLabel.emit(true);
  }

  ngOnInit(): void {}
}
