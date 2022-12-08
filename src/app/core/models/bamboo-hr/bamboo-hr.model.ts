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
  emails_selected: string[];
}

export type BambooHRConfigurationPost = {
  org: number;
  additional_email_options: EmailOption[];
  emails_selected: string[];
}

export type BambooHrConnection = {
  input: {
    api_token : string;
    subdomain: string;
  }
}

export type RecipeStatus = {
  payload: 'stop' | 'start';
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
      additional_email_options: bambooHrConfigurationForm.value.additional_email_options ? bambooHrConfigurationForm.value.additional_email_options : [],
      emails_selected: bambooHrConfigurationForm.value.emails.map((option: EmailOption) => option.email)
    };
  }

  static constructRecipeUpdatePayload(currentStatus: boolean): RecipeStatus {
    return {
      payload: currentStatus ? 'stop' : 'start'
    };
  }
}
