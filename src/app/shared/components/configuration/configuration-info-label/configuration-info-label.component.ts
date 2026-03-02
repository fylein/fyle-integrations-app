import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { WindowService } from 'src/app/core/services/common/window.service';

@Component({
    selector: 'app-configuration-info-label',
    templateUrl: './configuration-info-label.component.html',
    styleUrls: ['./configuration-info-label.component.scss'],
    standalone: false
})
export class ConfigurationInfoLabelComponent implements OnInit {

  @Input() infoText: string;

  @Input() showIcon: boolean = true;

  @Input() showCloseIcon: boolean = false;

  @Input() customClasses: string = '';

  @Output() closeInfoLabel = new EventEmitter<boolean>();

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  @Input() iconSrc: string;

  @Input() customStyleClass: any;

  @Input() customBackgroundColorClass: any;

  @Input() readMoreLink: string;

  @Input() readMoreText: string = this.translocoService.translate('common.readMoreText');

  constructor(
    private windowService: WindowService,
    private translocoService: TranslocoService
  ) { }

  clearSearch() {
    this.closeInfoLabel.emit(true);
  }

  readMoreClick(): void {
    this.windowService.openInNewTab(this.readMoreLink);
  }

  ngOnInit(): void {
  }
}
