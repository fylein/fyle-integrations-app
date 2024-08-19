import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { BambooHRConfigurationPost } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import { AppName, ClickEvent, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { EmailOptions } from 'src/app/core/models/qbd/qbd-configuration/qbd-advanced-setting.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { EmailOption } from 'src/app/core/models/intacct/intacct-configuration/advanced-settings.model';
import { trackingAppMap } from 'src/app/core/models/misc/tracking.model';
import { brandingConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-email-multi-select-field',
  templateUrl: './email-multi-select-field.component.html',
  styleUrls: ['./email-multi-select-field.component.scss']
})
export class EmailMultiSelectFieldComponent implements OnInit {

  selectedEmail: string | null;

  @Input() options: EmailOptions[];

  @Input() form: FormGroup;

  @Input() iconPath: string;

  @Input() label: string;

  @Input() subLabel: string;

  @Input() placeholder: string;

  @Input() formControllerName: string;

  @Input() isFieldMandatory: boolean;

  @Input() mandatoryErrorListName: string;

  @Input() customErrorMessage: string;

  @Input() isCloneSettingView: boolean;

  @Input() appName: AppName;

  addEmailForm: FormGroup = this.formBuilder.group({
    email: [null, Validators.compose([Validators.email, Validators.required])],
    name: [null, Validators.required]
  });

  @Output() updateConfiguration = new EventEmitter<BambooHRConfigurationPost>();

  showDialog: boolean;

  emails: EmailOptions[];

  readonly brandingConfig = brandingConfig;

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private trackingService: TrackingService,
    private toastService: IntegrationsToastService
  ) { }

  isOverflowing(element: any): boolean {
    return element.offsetWidth < element.scrollWidth;
  }

  clearSearch(options: DropdownFilterOptions): void {
    if (options.reset) {
      options.reset();
    }
    this.form.controls.search.patchValue(null);
  }

  removeEmail(): void {
    const selectedEmails = this.form.value.email;
    selectedEmails.splice(0, 1);

    this.form.controls.email.patchValue(selectedEmails);
    this.selectedEmail = this.form.value.email.length ? this.form.value.email[0].email : null;
  }

  addEmail(): void {
    this.trackingService.onClickEvent(trackingAppMap[this.appName], ClickEvent.ADD_EMAIL_MANUALLY);
    const selectedEmails = this.form.value.email;
    selectedEmails.push(this.addEmailForm.value);
    this.emails.push(this.addEmailForm.value);
    this.assignSelectedEmail(selectedEmails);
    this.form.controls.email.patchValue(selectedEmails);
    if (this.form.controls.additionalEmails) {
      const additionalEmails = this.form.controls.additionalEmails.value;
      additionalEmails.push(this.addEmailForm.value);
      this.form.controls.additionalEmails.patchValue(additionalEmails);
    }
    this.addEmailForm.reset();
    this.showDialog = false;
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Email address saved successfully');
  }

  private assignSelectedEmail(emails: EmailOptions[]): void {
    if (emails.length) {
      this.selectedEmail = emails[0].email;
    } else {
      this.selectedEmail = null;
    }
  }

  private createEmailAdditionWatcher(): void {
    this.assignSelectedEmail(this.form.value.email);
    this.form.controls.email.valueChanges.subscribe((emails: EmailOptions[]) => {
      this.assignSelectedEmail(emails);
    });
  }

  private getEmailOptions(additionalEmails: EmailOptions[], adminEmails: EmailOptions[]): EmailOptions[] {
    return additionalEmails.concat(adminEmails).filter((email: EmailOptions, index: number, self: EmailOptions[]) => {
      return index === self.findIndex((e: EmailOptions) => {
        return e.email === email.email;
      });
    });
  }

  private setupPage(): void {
    this.assignSelectedEmail(this.form.value.email);
    this.emails = this.getEmailOptions(this.form.value.email, this.options);
    this.createEmailAdditionWatcher();
  }

  openDialog(): void {
    this.showDialog = true;
  }

  closeModel() {
    this.addEmailForm.reset();
    this.showDialog = false;
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
