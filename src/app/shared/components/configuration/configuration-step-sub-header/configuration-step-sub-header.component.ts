import { Component, Input, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-configuration-step-sub-header',
  templateUrl: './configuration-step-sub-header.component.html',
  styleUrls: ['./configuration-step-sub-header.component.scss']
})
export class ConfigurationStepSubHeaderComponent implements OnInit {

  @Input() label: string;

  @Input() subLabel: string | SafeHtml;

  constructor() { }

  ngOnInit(): void {
  }

}
