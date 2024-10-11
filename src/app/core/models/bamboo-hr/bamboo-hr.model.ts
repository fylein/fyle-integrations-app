import { FormGroup } from "@angular/forms";

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

export type BambooHRConfiguration = {
  id: number;
  org: number;
  recipe_id: string;
  recipe_data: string;
  recipe_status: boolean;
  additional_email_options: EmailOption[];
  emails_selected: EmailOption[];
}

export type BambooHRConfigurationPost = {
  org: number;
  additional_email_options: EmailOption[];
  emails_selected: EmailOption[];
}

export type BambooHrConnection = {
  input: {
    api_token : string;
    subdomain: string;
  }
}

export class BambooHrModel {
  static constructBambooConnectionPayload(bambooConnectionForm: FormGroup): BambooHrConnection {
    return {
      input: {
        api_token: bambooConnectionForm.get('apiToken')?.value,
        subdomain: bambooConnectionForm.get('subDomain')?.value
      }
    };
  }

  static constructBambooConfigurationPayload(bambooHrConfigurationForm: FormGroup, orgId: number): BambooHRConfigurationPost {
    return {
      org: orgId,
      additional_email_options: bambooHrConfigurationForm.get('additionalEmails')?.value ? bambooHrConfigurationForm.get('additionalEmails')?.value : [],
      emails_selected: bambooHrConfigurationForm.get('email')?.value
    };
  }
}
