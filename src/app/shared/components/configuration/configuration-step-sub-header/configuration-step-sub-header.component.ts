import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-configuration-step-sub-header',
  templateUrl: './configuration-step-sub-header.component.html',
  styleUrls: ['./configuration-step-sub-header.component.scss']
})
export class ConfigurationStepSubHeaderComponent implements OnInit {

  @Input() label: string;

  @Input() subLabel: string | SafeHtml;

  @Input() showPreview: boolean = false;

  @Output() isPreviewClick = new EventEmitter();

  constructor() { }

  previewClick() {
    this.isPreviewClick.emit();
  }

  ngOnInit(): void {
  }

}
