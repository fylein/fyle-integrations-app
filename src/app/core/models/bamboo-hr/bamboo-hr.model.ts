import type { FormGroup } from "@angular/forms";

export interface EmailOption {
  email: string;
  name: string;
}

export interface BambooHr {
  id: number;
  org: number;
  folder_id: string;
  package_id: string;
  api_token: string;
  sub_domain: string;
  created_at: Date;
  updated_at: Date;
}

export interface BambooHRConfiguration {
  id: number;
  org: number;
  recipe_id: string;
  recipe_data: string;
  recipe_status: boolean;
  additional_email_options: EmailOption[];
  emails_selected: EmailOption[];
}

export interface BambooHRConfigurationPost {
  org: number;
  additional_email_options: EmailOption[];
  emails_selected: EmailOption[];
}

export interface BambooHrConnection {
  input: {
    api_token : string;
    subdomain: string;
  }
}

export class BambooHrModel {
  static constructBambooConnectionPayload(bambooConnectionForm: FormGroup): BambooHrConnection {
    return {
      input: {
        api_token: bambooConnectionForm.value.apiToken,
        subdomain: bambooConnectionForm.value.subDomain
      }
    };
  }

  static constructBambooConfigurationPayload(bambooHrConfigurationForm: FormGroup, orgId: number): BambooHRConfigurationPost {
    return {
      org: orgId,
      additional_email_options: bambooHrConfigurationForm.value.additionalEmails ? bambooHrConfigurationForm.value.additionalEmails : [],
      emails_selected: bambooHrConfigurationForm.value.email
    };
  }
}
