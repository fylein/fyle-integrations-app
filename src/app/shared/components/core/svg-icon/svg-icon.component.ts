import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { brandingConfig } from 'src/app/branding/branding-config';

const ICON_MAPPING = {
  'arrow-down': 'grv-chevron-down',
  'arrow-line': 'arrow-line',
  'arrow-rotate-sync': 'grv-recurring-small',
  'arrow-rotate': 'grv-recurring',
  'arrow-tail-down-medium': 'grv-arrow-down-medium',
  'arrow-tail-down': 'grv-arrow-down',
  'arrow-tail-left-medium': 'grv-arrow-left-medium',
  'arrow-tail-right-medium': 'grv-arrow-right-medium',
  'arrow-tail-right-small': 'grv-arrow-right-small',
  'arrow-tail-up-down': 'grv-sort',
  'arrow-tail-up-medium': 'grv-arrow-up-medium',
  'arrow-tail-up': 'grv-arrow-up',
  'bin': 'grv-trash',
  'calendar': 'grv-calendar',
  'calendar-medium': 'grv-calendar-medium',
  'check-circle-outline-small': 'grv-checkmark-encircled-small',
  'check-circle-outline': 'grv-checkmark-encircled',
  'check-circle-outline-medium': 'grv-checkmark-encircled-medium',
  'check-circle-outline-extra-large': 'grv-checkmark-encircled-extra-large',
  'check-medium': 'grv-checkmark-medium',
  'check': 'grv-checkmark',
  'check-large': 'grv-checkmark-large',
  'cross-xs-small': 'grv-close-xs-small',
  'cross-medium': 'grv-close-medium',
  'cross-small': 'grv-close-small',
  'cross': 'grv-close',
  'danger-fill': 'grv-caution-triangle-critical',
  'danger-outline': 'grv-caution-triangle',
  'download': 'grv-download',
  'duplicate': 'grv-copy',
  'envelope': 'grv-envelope',
  'eye-slash': 'grv-show-hide',
  'eye': 'grv-show',
  'flash-on': 'grv-flash-on',
  'gear-medium': 'grv-settings-medium',
  'gear': 'grv-settings',
  'info-circle-fill-medium': 'c1-info-medium',
  'info-circle-fill': 'c1-info-small',
  'line': 'grv-line',
  'link-vertical-medium': 'grv-link-medium',
  'list': 'grv-notes',
  'mapping-medium': 'grv-transfer-medium',
  'open-in-new-tab-standard': 'grv-external-standard',
  'open-in-new-tab': 'grv-external',
  'plus-square-medium': 'grv-plus-encircled',
  'question-square-outline': 'grv-info',
  'tabs': 'grv-budle',
  'user-plus': 'grv-person',
  'user-two': 'grv-persons',
  'warning-outline': 'grv-caution-triangle-small',
  'grv-cross-filled-medium': 'grv-cross-filled-medium',
  'search-medium': 'grv-search-medium',
  'arrow-left-medium': 'grv-chevron-left-medium',
  'arrow-right-medium': 'grv-chevron-right-medium',
  'arrow-bar-left-medium': 'grv-chevron-first-medium',
  'arrow-bar-right-medium': 'grv-chevron-last-medium',
  'upload': 'grv-upload',
  'lock': 'grv-lock',
  'eye-slash-medium': 'grv-show-hide-medium',
  'eye-medium': 'grv-show-medium'
};

@Component({
  selector: 'app-svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent implements OnInit {

  @Input() svgSource: string;

  @Input() c1SvgSource: string;

  @Input() width: string;

  @Input() height: string;

  @Input() styleClasses: string = '';

  @Input() tooltipPosition: string = 'top';

  @Input() tooltipText: string;

  @Input() isTextColorAllowed: boolean = false;

  @Output() iconClick = new EventEmitter();

  constructor() { }

  iconClickEvent() {
    this.iconClick.emit();
  }

  private setupProperties(): void {
    if (brandingConfig.brandId === 'co') {
      if (this.c1SvgSource) {
        this.svgSource = this.c1SvgSource.toString();
      } else {
        // @ts-ignore
        this.svgSource = ICON_MAPPING[this.svgSource];
      }

      if (!this.isTextColorAllowed) {
        // Remove all text classes and add default text color
        this.styleClasses = this.styleClasses.split(' ').filter((styleClass: string) => (!styleClass.startsWith('tw-text-') ? styleClass: '')).join(' ');

        this.styleClasses += ' tw-text-icon-primary';
      }
    }
  }

  ngOnInit(): void {
    this.setupProperties();
  }

}
