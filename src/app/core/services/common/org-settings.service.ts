import { Injectable, signal, computed } from '@angular/core';
import { OrgSettings, CurrencyFormat, RegionalSettings } from '../../models/common/org-settings.model';

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

  readonly dateFormat = computed(() => this.regionalSettings()?.date_format ?? 'MMM dd, yyyy');

  readonly timeFormat = computed(() => this.regionalSettings()?.time_format ?? 'h:mm a');

  readonly currencyFormat = computed<CurrencyFormat>(() => (
    this.regionalSettings()?.currency_format ?? {
      symbol_position: 'before',
      decimal_separator: '.',
      thousand_separator: ','
    }
  ));

  // Setter method (only this service can write)
  setOrgSettings(settings: OrgSettings | {}): void {
    if (!settings || !('regional_settings' in settings)) {
      return;
    }
    this.orgSettingsSignal.set(settings);
  }
}
