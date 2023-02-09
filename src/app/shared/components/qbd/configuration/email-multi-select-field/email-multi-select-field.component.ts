import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { BambooHRConfigurationPost } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import { QBDEmailOption } from 'src/app/core/models/qbd/qbd-configuration/advanced-setting.model';

@Component({
  selector: 'app-email-multi-select-field',
  templateUrl: './email-multi-select-field.component.html',
  styleUrls: ['./email-multi-select-field.component.scss']
})
export class EmailMultiSelectFieldComponent implements OnInit {

  selectedEmail: string | null;

  @Input() options: QBDEmailOption[];

  @Input() form: FormGroup;

  @Input() iconPath: string;

  @Input() label: string;

  @Input() subLabel: string;

  @Input() placeholder: string;

  @Input() formControllerName: string;

  cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" }
  ];

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
    const selectedEmails = this.form.value.emails_selected;
    selectedEmails.splice(0, 1);

    this.form.controls.emails_selected.patchValue(selectedEmails);
    this.selectedEmail = this.form.value.emails_selected.length ? this.form.value.emails_selected[0].email : null;
  }

  addEmail(): void {
    const selectedEmails = this.form.value.emails_selected;
    selectedEmails.push(this.addEmailForm.value);
    this.emails.push(this.addEmailForm.value);
    this.assignSelectedEmail(selectedEmails);
    this.form.controls.emails_selected.patchValue(selectedEmails);
    this.addEmailForm.reset();
    this.showDialog = false;
  }

  private assignSelectedEmail(emails: QBDEmailOption[]): void {
    if (emails.length) {
      this.selectedEmail = emails[0].email;
    } else {
      this.selectedEmail = null;
    }
  }

  private createEmailAdditionWatcher(): void {
    this.assignSelectedEmail(this.form.value.emails_selected);
    this.form.controls.emails_selected.valueChanges.subscribe((emails: QBDEmailOption[]) => {
      this.assignSelectedEmail(emails);
    });
  }

  private getEmailOptions(additionalEmails: QBDEmailOption[], adminEmails: QBDEmailOption[]): QBDEmailOption[] {
    return additionalEmails.concat(adminEmails).filter((email: QBDEmailOption, index: number, self: QBDEmailOption[]) => {
      return index === self.findIndex((e: QBDEmailOption) => {
        return e.email === email.email;
      });
    });
  }

  private setupPage(): void {
    this.emails = this.getEmailOptions(this.form.value.emails_selected, this.options);

    this.createEmailAdditionWatcher();
  }

  openDialog(): void {
    this.showDialog = true;
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
