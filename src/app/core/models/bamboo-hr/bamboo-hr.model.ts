export type FrequencyFormOption = {
  label: string;
  value: number;
}

export type EmailOption = {
  email: string;
  name: string;
}

export type BambooHr = {
  id: number;
  org: number;
  folder_id: string;
  package_id: string;
  api_token: string;
  sub_domain: string;
  created_at: Date;
  updated_at: Date;
}
