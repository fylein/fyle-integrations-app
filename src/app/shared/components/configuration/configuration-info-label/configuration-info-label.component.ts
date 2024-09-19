import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-configuration-info-label',
  templateUrl: './configuration-info-label.component.html',
  styleUrls: ['./configuration-info-label.component.scss']
})
export class ConfigurationInfoLabelComponent implements OnInit {

  @Input() infoText: string;

  constructor() { }

  ngOnInit(): void {
  }

}
