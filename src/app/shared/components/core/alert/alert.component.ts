import { Component, Input } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

type AlertType = 'info' | 'danger';
type AlertVariant = 'standard' | 'subtle' | 'subtle-bordered';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  @Input() type: AlertType = 'info';

  @Input() variant: AlertVariant = 'standard';

  @Input() title?: string;

  private readonly iconMap = {
    filled: {
      info: 'assets/icons/info-circle-fill-blue.svg',
      danger: 'assets/icons/danger-fill.svg'
    },
    white: {
      info: 'assets/icons/info-circle-fill-white.svg',
      danger: 'assets/icons/danger-fill-white.svg'
    }
  } satisfies Record<string, Record<AlertType, string>>;

  private readonly iconAltKeyMap = {
    info: 'alert.infoIconAlt',
    danger: 'alert.dangerIconAlt'
  } satisfies Record<AlertType, string>;

  get iconSrc(): string {
    if (this.variant === 'standard') {
      return this.iconMap.white[this.type];
    }
    return this.iconMap.filled[this.type];
  }

  get iconAlt(): string {
    return this.translocoService.translate(this.iconAltKeyMap[this.type]);
  }

  constructor(
    private translocoService: TranslocoService
  ) { }
}
