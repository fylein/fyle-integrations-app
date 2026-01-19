import { Injectable, signal, computed } from '@angular/core';
import { OrgSettings, CurrencyFormat, RegionalSettings } from '../../models/common/org-settings.model';
import { PrimeNG } from 'primeng/config';

@Injectable({
  providedIn: 'root'
})
export class OrgSettingsService {
  // Private writable signal
  private orgSettingsSignal = signal<OrgSettings | null>(null);

  // Public readonly signal
  readonly orgSettings = this.orgSettingsSignal.asReadonly();

  // Computed values for convenience
  readonly regionalSettings = computed<RegionalSettings>(() => this.orgSettings()?.regional_settings ?? {
    date_format: 'MMM dd, yyyy',
    time_format: 'h:mm a',
    currency_format: {
      symbol_position: 'before',
      decimal_separator: '.',
      thousand_separator: ','
    }
  });

  readonly dateFormat = computed(() => this.regionalSettings()?.date_format);

  readonly timeFormat = computed(() => this.regionalSettings()?.time_format);

  readonly currencyFormat = computed(() => this.regionalSettings()?.currency_format);

  constructor(
    private primeNg: PrimeNG
  ) {}

  // Setter method (only this service can write)
  setOrgSettings(settings?: OrgSettings | {}): void {
    if (!settings || !('regional_settings' in settings)) {
      return;
    }
    this.orgSettingsSignal.set(settings);

    const primengFormat = this.convertToPrimengFormat(this.dateFormat());
    this.primeNg.setTranslation({ dateFormat: primengFormat });
  }

  private convertToPrimengFormat(dateFormat: string): string {
    return dateFormat
      .replace(/yyyy/g, 'yy')
      .replace(/MMMM/g, 'MM')
      .replace(/MMM/g, 'M')
      .replace(/\bMM\b/g, 'mm');
  }
}
