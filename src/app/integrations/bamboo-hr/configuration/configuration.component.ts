import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import type { DropdownFilterOptions } from 'primeng/dropdown';
import { brandingConfig } from 'src/app/branding/branding-config';
import type { BambooHRConfiguration, BambooHRConfigurationPost, EmailOption } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import { BambooHrModel } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import { AppName, ClickEvent, TrackingApp } from 'src/app/core/models/enum/enum.model';
import type { Org } from 'src/app/core/models/org/org.model';
import type { TrackingService } from 'src/app/core/services/integration/tracking.service';
import type { OrgService } from 'src/app/core/services/org/org.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  @Input() bambooHrConfiguration: BambooHRConfiguration;

  @Input() additionalEmails: EmailOption[];

  @Input() isConfigurationSaveInProgress: boolean;

  @Output() updateConfiguration = new EventEmitter<BambooHRConfigurationPost>();

  emails: EmailOption[];

  selectedEmail: string | null;

  cofigurationForm: FormGroup;

  addEmailForm: FormGroup = this.formBuilder.group({
    email: [null, Validators.compose([Validators.email, Validators.required])],
    name: [null, Validators.required]
  });

  showDialog: boolean;

  appName = AppName.BAMBOO_HR;

  readonly brandingConfig = brandingConfig;

  private readonly org: Org = this.orgService.getCachedOrg();

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private orgService: OrgService,
    private trackingService: TrackingService
  ) { }

  clearSearch(options: DropdownFilterOptions): void {
    if (options.reset) {
      options.reset();
    }
    this.cofigurationForm.controls.search.reset();
  }

  removeEmail(): void {
    const selectedEmails = this.cofigurationForm.value.emails;
    selectedEmails.splice(0, 1);

    this.cofigurationForm.controls.emails.patchValue(selectedEmails);
    this.selectedEmail = this.cofigurationForm.value.emails.length ? this.cofigurationForm.value.emails[0].email : null;
  }

  addEmail(): void {
    this.trackingService.onClickEvent(TrackingApp.BAMBOO_HR, ClickEvent.ADD_BAMBOO_HR_EMAIL_MANUALLY);
    const selectedEmails = this.cofigurationForm.value.emails || [];
    selectedEmails.push(this.addEmailForm.value);

    const additionalEmails = this.cofigurationForm.value.additionalEmails || [];
    additionalEmails.push(this.addEmailForm.value);

    this.emails.push(this.addEmailForm.value);

    this.cofigurationForm.controls.emails.patchValue(selectedEmails);
    this.cofigurationForm.controls.additionalEmails.patchValue(additionalEmails);
    this.addEmailForm.reset();
    this.showDialog = false;
  }

  saveSettings(): void {
    if (!this.isConfigurationSaveInProgress) {
      const payload = BambooHrModel.constructBambooConfigurationPayload(this.cofigurationForm, this.org.id);
      this.updateConfiguration.emit(payload);
    }
  }

  private assignSelectedEmail(emails: EmailOption[]): void {
    if (emails.length) {
      this.selectedEmail = emails[0].email;
    } else {
      this.selectedEmail = null;
    }
  }

  private createEmailAdditionWatcher(): void {
    this.assignSelectedEmail(this.cofigurationForm.value.emails);
    this.cofigurationForm.controls.emails.valueChanges.subscribe((emails: EmailOption[]) => {
      this.assignSelectedEmail(emails);
    });
  }

  private getEmailOptions(additionalEmails: EmailOption[], adminEmails: EmailOption[]): EmailOption[] {
    return additionalEmails.concat(adminEmails).filter((email: EmailOption, index: number, self: EmailOption[]) => {
      return index === self.findIndex((e: EmailOption) => {
        return e.email === email.email;
      });
    });
  }

  private setupPage(): void {
    this.cofigurationForm = this.formBuilder.group({
      additionalEmails: [this.bambooHrConfiguration?.additional_email_options ? this.bambooHrConfiguration.additional_email_options : []],
      email: [this.bambooHrConfiguration?.emails_selected ? this.bambooHrConfiguration?.emails_selected : [], Validators.required],
      search: []
    });

    this.emails = this.getEmailOptions(this.cofigurationForm.value.additionalEmails, this.additionalEmails);

    this.createEmailAdditionWatcher();
  }

  openDialog(): void {
    this.showDialog = true;
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
