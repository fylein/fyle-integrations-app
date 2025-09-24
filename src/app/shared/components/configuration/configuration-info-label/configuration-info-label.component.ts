import { Component, Input, OnInit } from '@angular/core';
import { brandingStyle } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-configuration-info-label',
  templateUrl: './configuration-info-label.component.html',
  styleUrls: ['./configuration-info-label.component.scss']
})
export class ConfigurationInfoLabelComponent implements OnInit {

  @Input() infoText: string;

  @Input() showIcon: boolean = true;

  readonly brandingStyle = brandingStyle;

  constructor() { }

  ngOnInit(): void {
  }

}
