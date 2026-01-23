import { Pipe, PipeTransform } from '@angular/core';
import { OrgSettingsService } from 'src/app/core/services/common/org-settings.service';
import currency from 'currency.js';

@Pipe({
  name: 'orgCurrency',
  standalone: false
})
export class OrgCurrencyPipe implements PipeTransform {
  constructor(
    private orgSettingsService: OrgSettingsService
  ) {}

  /**
   * Formats a value as currency using the organization's currency format
   * @param value - The value to format as currency
   * @returns The formatted currency value
   */
  transform(
    value: string | number
  ): string {
    const numericValue = typeof value === 'string' ? Number(value) : value;
    if (numericValue === null || Number.isNaN(numericValue)) {
      return '';
    }

    // Get format preferences
    const currencyFormat = this.orgSettingsService.currencyFormat();
    const symbolPosition = currencyFormat?.symbol_position;
    const thousandSeparator = currencyFormat?.thousand_separator;
    const decimalSeparator = currencyFormat?.decimal_separator;

    const currencyCode = 'USD'; // TODO: Get from org settings - home currency
    const precision = 2; // Default precision
    let currencyToken = '';

    /**
     * Resolve the currency token ($) from the currency code (USD)
     */
    try {
      const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'symbol'
      });
      const tokenParts = currencyFormatter.formatToParts(1);
      currencyToken = tokenParts.find((p) => p.type === 'currency')?.value || currencyCode;
    } catch {
      // If it is a symbol like $, use it as-is
      currencyToken = currencyCode;
    }


    /*
     * Add a space when we're effectively showing a currency code (not a symbol)
     * (when the symbol resolved by Intl is identical to the ISO code like 'OMR')
     */
    const isCodeLikeSymbol = currencyToken && currencyCode && currencyToken === currencyCode;
    const needsSpace = isCodeLikeSymbol;

    let pattern: string;
    if (symbolPosition === 'after') {
      pattern = needsSpace ? '# !' : '#!';
    } else {
      pattern = needsSpace ? '! #' : '!#';
    }

    return currency(numericValue, {
      symbol: currencyToken,
      separator: thousandSeparator,
      decimal: decimalSeparator,
      pattern: pattern,
      precision: precision
    }).format();
  }

}
