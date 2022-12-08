import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { BambooHRConfiguration, BambooHrModel, EmailOption } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import { Org } from 'src/app/core/models/org/org.model';
import { BambooHrService } from 'src/app/core/services/bamboo-hr/bamboo-hr.service';
import { OrgService } from 'src/app/core/services/org/org.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  @Input() bambooHrConfiguration: BambooHRConfiguration;

  @Output() updateConfiguration = new EventEmitter<BambooHRConfiguration>();

  emails: EmailOption[] = [
    {
      name: 'Ashwin',
      email: 'ashwin.t@fyle.in'
    },
    {
      name: 'Shwetabh',
      email: 'ashwin.t2@fyle.in'
    },
    {
      name: 'Musk',
      email: 'ashwin3.t@fyle.in'
    }
  ];

  selectedEmail: string | null;

  cofigurationForm: FormGroup;

  addEmailForm: FormGroup = this.formBuilder.group({
    email: [null, Validators.compose([Validators.email, Validators.required])],
    name: [null, Validators.required]
  });

  showDialog: boolean;

  isEmployeeDimensionEnabled: boolean;

  private readonly org: Org = this.orgService.getCachedOrg();

  constructor(
    private bambooHrService: BambooHrService,
    private formBuilder: FormBuilder,
    private orgService: OrgService
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
    this.selectedEmail = this.cofigurationForm.value.emails ? this.cofigurationForm.value.emails[0].email : null;
  }

  addEmail(): void {
    const selectedEmails = this.cofigurationForm.value.emails || [];
    selectedEmails.push(this.addEmailForm.value);
    this.emails.push(this.addEmailForm.value);

    this.cofigurationForm.controls.emails.patchValue(selectedEmails);
    this.addEmailForm.reset();
    this.showDialog = false;
  }

  saveSettings(): void {
    const payload = BambooHrModel.constructBambooConfigurationPayload(this.cofigurationForm, this.org.id);
    this.bambooHrService.postConfigurations(payload).subscribe((updatedConfiguration: BambooHRConfiguration) => {
      this.updateConfiguration.emit(updatedConfiguration);
    });
  }

  private createEmailAdditionWatcher(): void {
    this.cofigurationForm.controls.emails.valueChanges.subscribe((emails: EmailOption[]) => {
      if (emails.length) {
        this.selectedEmail = emails[0].email;
      } else {
        this.selectedEmail = null;
      }
    });
  }

  private setupPage(): void {
    // TODO: Get the additional emails from backend and assign to additionalEmails
    this.cofigurationForm = this.formBuilder.group({
      additionalEmails: [null],
      emails: [this.bambooHrConfiguration?.emails_selected, Validators.required],
      search: []
    });

    this.createEmailAdditionWatcher();
  }

  openDialog(): void {
    this.showDialog = true;
  }

  ngOnInit(): void {
    this.isEmployeeDimensionEnabled = true;
    this.setupPage();
  }

}
