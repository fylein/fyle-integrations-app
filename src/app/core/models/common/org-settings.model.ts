export type CurrencyFormat = {
  symbol_position: 'before' | 'after';
  decimal_separator: '.' | ',';
  thousand_separator: '.' | ',';
};

export type RegionalSettings = {
  // Possible values: 'MMM dd, yyyy' | 'MM/dd/yyyy' | 'dd/MM/yyyy' | 'yyyy/MM/dd' | 'MM-dd-yyyy' | 'dd-MM-yyyy' | 'yyyy-MM-dd' | 'MM.dd.yyyy' | 'dd.MM.yyyy' | 'yyyy.MM.dd' | 'MM dd yyyy' | 'dd MM yyyy' | 'yyyy MM dd';
  date_format: string;
  time_format: 'h:mm a' | 'HH:mm';
  currency_format: CurrencyFormat;
};

export type OrgSettings = {
  regional_settings: RegionalSettings;
};

