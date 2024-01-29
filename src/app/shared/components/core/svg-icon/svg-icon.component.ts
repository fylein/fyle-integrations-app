import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { brandingConfig } from 'src/app/branding/branding-config';

const ICON_MAPPING = {
  'arrow-down': 'grv-chevron-down',
  'arrow-line': 'arrow-line',
  'arrow-rotate-sync': 'grv-recurring-small',
  'arrow-rotate': 'grv-recurring',
  'arrow-tail-down-medium': 'grv-arrow-down-medium',
  'arrow-tail-down': 'grv-arrow-down',
  'arrow-tail-up-down': 'grv-sort',
  'arrow-tail-up-medium': 'grv-arrow-up-medium',
  'arrow-tail-up': 'grv-arrow-up',
  'bin': 'grv-trash',
  'calendar': 'grv-calendar',
  'check-circle-outline-small': 'grv-checkmark-encircled-small',
  'check-circle-outline': 'grv-checkmark-encircled',
  'check-circle-outline-medium': 'grv-checkmark-encircled-medium',
  'check-medium': 'grv-checkmark-medium',
  'check': 'grv-checkmark',
  'check-large': 'grv-checkmark-large',
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
  'info-circle-fill-medium': 'info-medium',
  'info-circle-fill': 'info',
  'line': 'line',
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
  'warning-outline': 'warning-outline'
};

@Component({
  selector: 'app-svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent implements OnInit {

  @Input() svgSource: string;

  @Input() width: string;

  @Input() height: string;

  @Input() styleClasses: string;

  @Input() tooltipPosition: string = 'top';

  @Input() tooltipText: string;

  @Output() iconClick = new EventEmitter();

  constructor() { }

  iconClickEvent() {
    this.iconClick.emit();
  }

  private setupProperties(): void {
    if (brandingConfig.brandId === 'co') {
      // @ts-ignore
      this.svgSource = ICON_MAPPING[this.svgSource];

      // Remove all text classes
      this.styleClasses = this.styleClasses.split(' ').filter((styleClass: string) => (!styleClass.startsWith('tw-text-') ? styleClass: '')).join(' ');
    }
  }

  ngOnInit(): void {
    this.setupProperties();
  }

}
