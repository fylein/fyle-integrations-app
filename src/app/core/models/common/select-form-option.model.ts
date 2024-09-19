export interface SelectFormOption {
  label: string;
  value: string | null | number | boolean;
  subLabel?: string;
}

export interface SelectFormLabel {
  label: string;
  value: string;
}

export interface EmailOption {
  email: string;
  name: string;
}
