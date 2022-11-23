import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { EmailOption, FrequencyFormOption } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  frequencyIntervals: FrequencyFormOption[] = [...Array(24).keys()].map(day => {
    return {
      label: (day + 1) === 1 ? (day + 1) + ' Hour' : (day + 1) + ' Hours',
      value: day + 1
    };
  });

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

  constructor(
    private formBuilder: FormBuilder
  ) { }

  clearSearch(options: DropdownFilterOptions): void {
    if (options.reset) {
      options.reset();
    }
    this.cofigurationForm.controls.search.reset();
  }

  removeEmail(): void {
    this.emails.splice(0, 1);
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
    // TODO
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
    this.cofigurationForm = this.formBuilder.group({
      emails: [],
      frequencyInterval: [],
      search: []
    });

    this.createEmailAdditionWatcher();
  }

  openDialog(): void {
    this.showDialog = true;
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
