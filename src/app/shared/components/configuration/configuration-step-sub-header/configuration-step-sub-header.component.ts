import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { brandingStyle } from 'src/app/branding/branding-config';
import { WindowService } from 'src/app/core/services/common/window.service';

@Component({
  selector: 'app-configuration-step-sub-header',
  templateUrl: './configuration-step-sub-header.component.html',
  styleUrls: ['./configuration-step-sub-header.component.scss']
})
export class ConfigurationStepSubHeaderComponent implements OnInit {

  @Input() label: string;

  @Input() subLabel: string | SafeHtml;

  @Input() showPreview: boolean = false;

  @Input() readMoreLink: string;

  @Input() readMoreLinkText: string;

  @Output() isPreviewClick = new EventEmitter();

  brandingStyle = brandingStyle;

  constructor(
    private windowService: WindowService
  ) { }

  previewClick() {
    this.isPreviewClick.emit();
  }

  readMoreClick(): void {
    this.windowService.openInNewTab(this.readMoreLink);
  }

  ngOnInit(): void {
  }

}
