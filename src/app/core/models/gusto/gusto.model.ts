import { FormGroup } from "@angular/forms";

export type EmailOption = {
    email: string;
    name: string;
}

export type Gusto = {
    id: number;
    org: number;
    folder_id: string;
    package_id: string;
    connection_id: string;
    created_at: Date;
    updated_at: Date;
}

export type GustoConfiguration = {
    id: number;
    org: number;
    recipe_id: string;
    recipe_data: string;
    recipe_status: boolean;
    additional_email_options: EmailOption[];
    emails_selected: EmailOption[];
}

  export type GustoConfigurationPost = {
    org: number;
    additional_email_options: EmailOption[];
    emails_selected: EmailOption[];
}

export class GustoModel {
    static constructGustoConfigurationPayload(GustoHrConfigurationForm: FormGroup, orgId: number): GustoConfigurationPost {
      return {
        org: orgId,
        additional_email_options: GustoHrConfigurationForm.value.additionalEmails ? GustoHrConfigurationForm.value.additionalEmails : [],
        emails_selected: GustoHrConfigurationForm.value.emails
      };
    }
  }