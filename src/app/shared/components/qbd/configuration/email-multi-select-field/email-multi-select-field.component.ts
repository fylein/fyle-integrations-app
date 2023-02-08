import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { BambooHRConfigurationPost, EmailOption } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';

@Component({
  selector: 'app-email-multi-select-field',
  templateUrl: './email-multi-select-field.component.html',
  styleUrls: ['./email-multi-select-field.component.scss']
})
export class EmailMultiSelectFieldComponent implements OnInit {

  selectedEmail: string;

  @Input() options: QBDExportSettingFormOption[] | string[];

  @Input() form: FormGroup;

  @Input() iconPath: string;

  @Input() label: string;

  @Input() subLabel: string;

  @Input() placeholder: string;

  @Input() formControllerName: string;

  addEmailForm: FormGroup = this.formBuilder.group({
    email: [null, Validators.compose([Validators.email, Validators.required])],
    name: [null, Validators.required]
  });

  @Output() updateConfiguration = new EventEmitter<BambooHRConfigurationPost>();

  showDialog: boolean;

  emails: any;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  clearSearch(options: DropdownFilterOptions): void {
    if (options.reset) {
      options.reset();
    }
    this.form.controls.search.reset();
  }

  removeEmail(): void {
    const selectedEmails = this.form.value.emails;
    selectedEmails.splice(0, 1);

    this.form.controls.emails.patchValue(selectedEmails);
    this.selectedEmail = this.form.value.emails.length ? this.form.value.emails[0].email : null;
  }

  addEmail(): void {
    const selectedEmails = this.form.value.emails || [];
    selectedEmails.push(this.addEmailForm.value);

    const additionalEmails = this.form.value.additionalEmails || [];
    additionalEmails.push(this.addEmailForm.value);

    this.emails.push(this.addEmailForm.value);

    this.form.controls.emails.patchValue(selectedEmails);
    this.form.controls.additionalEmails.patchValue(additionalEmails);
    this.addEmailForm.reset();
    this.showDialog = false;
  }

  private assignSelectedEmail(emails: EmailOption[]): void {
    this.selectedEmail = this.form.value.emails.length ? this.form.value.emails[0] : null;
  }

  private createEmailAdditionWatcher(): void {
    this.assignSelectedEmail(this.form.value.emails);
    this.form.controls.emails.valueChanges.subscribe((emails: EmailOption[]) => {
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

  // Private setupPage(): void {
  //   This.form = this.formBuilder.group({
  //     AdditionalEmails: [this.bambooHrConfiguration?.additional_email_options ? this.bambooHrConfiguration.additional_email_options : []],
  //     Emails: [this.bambooHrConfiguration?.emails_selected ? this.bambooHrConfiguration?.emails_selected : [], Validators.required],
  //     Search: []
  //   });

  //   This.emails = this.getEmailOptions(this.form.value.additionalEmails, this.additionalEmails);

  //   This.createEmailAdditionWatcher();
  // }

  openDialog(): void {
    this.showDialog = true;
  }

  ngOnInit(): void {
    this.selectedEmail = this.form.value.emails.length ? this.form.value.emails[0] : null;
  }

}
