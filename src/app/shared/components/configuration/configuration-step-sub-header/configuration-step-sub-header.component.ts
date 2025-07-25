import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-configuration-step-sub-header',
    templateUrl: './configuration-step-sub-header.component.html',
    styleUrls: ['./configuration-step-sub-header.component.scss'],
    standalone: false
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
