// Theme configuration types for brand switching
export interface BrandThemeConfig {
  brandId: 'fyle' | 'co';
  preset: any; // PrimeNG preset type
  name: string;
}

export type SupportedBrand = 'fyle' | 'co';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  white: string;
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray600: string;
  gray700: string;
  gray900: string;
  success: string;
  danger: string;
  info: string;
  warning: string;
  hyperlink: string;
  pink: string;
}