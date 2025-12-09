import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectFilterOptions } from 'primeng/select';
import { BambooHRConfigurationPost } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import { AppName, ButtonSize, ButtonType, ClickEvent, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { QBDEmailOptions } from 'src/app/core/models/qbd/qbd-configuration/qbd-advanced-setting.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { EmailOption } from 'src/app/core/models/intacct/intacct-configuration/advanced-settings.model';
import { trackingAppMap } from 'src/app/core/models/misc/tracking.model';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-email-multi-select-field',
  templateUrl: './email-multi-select-field.component.html',
  styleUrls: ['./email-multi-select-field.component.scss'],
  standalone: false,
})
export class EmailMultiSelectFieldComponent implements OnInit {
  selectedEmail: string | null;

  @Input() options: QBDEmailOptions[];

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

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  addEmailForm: FormGroup = this.formBuilder.group({
    email: [null, Validators.compose([Validators.email, Validators.required])],
    name: [null, Validators.required],
  });

  @Output() updateConfiguration = new EventEmitter<BambooHRConfigurationPost>();

  showDialog: boolean;

  emails: QBDEmailOptions[];

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private trackingService: TrackingService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService,
  ) {}

  isOverflowing(element: any): boolean {
    return element.offsetWidth < element.scrollWidth;
  }

  clearSearch(options: SelectFilterOptions): void {
    if (options.reset) {
      options.reset();
    }
    this.form.controls.search.patchValue(null);
  }

  removeEmail(): void {
    const selectedEmails = this.form.get('email')?.value;
    selectedEmails.splice(0, 1);

    this.form.controls.email.patchValue(selectedEmails);
    this.selectedEmail = this.form.get('email')?.value.length ? this.form.get('email')?.value[0].email : null;
  }

  addEmail(): void {
    this.trackingService.onClickEvent(trackingAppMap[this.appName], ClickEvent.ADD_EMAIL_MANUALLY);
    const selectedEmails = this.form.get('email')?.value;
    selectedEmails.push(this.addEmailForm.getRawValue());
    this.emails.push(this.addEmailForm.getRawValue());
    this.assignSelectedEmail(selectedEmails);
    this.form.controls.email.patchValue(selectedEmails);
    if (this.form.controls.additionalEmails) {
      const additionalEmails = this.form.controls.additionalEmails.value;
      additionalEmails.push(this.addEmailForm.getRawValue());
      this.form.controls.additionalEmails.patchValue(additionalEmails);
    }
    this.addEmailForm.reset();
    this.showDialog = false;
    this.toastService.displayToastMessage(
      ToastSeverity.SUCCESS,
      this.translocoService.translate('emailMultiSelectField.emailSavedSuccess'),
    );
  }

  private assignSelectedEmail(emails: QBDEmailOptions[]): void {
    if (emails.length) {
      this.selectedEmail = emails[0].email;
    } else {
      this.selectedEmail = null;
    }
  }

  private createEmailAdditionWatcher(): void {
    this.assignSelectedEmail(this.form.get('email')?.value);
    this.form.controls.email.valueChanges.subscribe((emails: QBDEmailOptions[]) => {
      this.assignSelectedEmail(emails);
    });
  }

  private getEmailOptions(additionalEmails: QBDEmailOptions[], adminEmails: QBDEmailOptions[]): QBDEmailOptions[] {
    return additionalEmails
      .concat(adminEmails)
      .filter((email: QBDEmailOptions, index: number, self: QBDEmailOptions[]) => {
        return (
          index ===
          self.findIndex((e: QBDEmailOptions) => {
            return e.email === email.email;
          })
        );
      });
  }

  private setupPage(): void {
    this.assignSelectedEmail(this.form.get('email')?.value);
    this.emails = this.getEmailOptions(this.form.get('email')?.value, this.options);
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
