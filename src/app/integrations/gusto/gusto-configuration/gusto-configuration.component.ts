import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppName, Page, QBDConfigurationCtaText, QBDOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { EmailOption, GustoConfiguration, GustoConfigurationPost, GustoModel } from 'src/app/core/models/gusto/gusto.model';
import { Org } from 'src/app/core/models/org/org.model';
import { GustoService } from 'fyle-integrations-ui-lib';
import { TrackingService } from 'fyle-integrations-ui-lib';
import { OrgService } from 'fyle-integrations-ui-lib';
import { QbdToastService } from 'fyle-integrations-ui-lib';

@Component({
  selector: 'app-gusto-configuration',
  templateUrl: './gusto-configuration.component.html',
  styleUrls: ['./gusto-configuration.component.scss']
})
export class GustoConfigurationComponent implements OnInit {

  @Input() gustoConfiguration: GustoConfiguration;

  @Input() additionalEmails: EmailOption[];

  @Output() updateConfiguration = new EventEmitter<GustoConfigurationPost>();

  configurationForm: FormGroup;

  saveInProgress: boolean;

  ConfigurationCtaText = QBDConfigurationCtaText;

  org: Org = this.orgService.getCachedOrg();

  configurationFields: string[] = ['Employee Name', 'Employee ID', 'Email ID', 'Department', 'Manager'];

  private sessionStartTime = new Date();

  constructor(
    private gustoService: GustoService,
    private formBuilder: FormBuilder,
    private orgService: OrgService,
    private trackingService: TrackingService,
    private toastService: QbdToastService
  ) { }

  private constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const configurationPayload = GustoModel.constructGustoConfigurationPayload(this.configurationForm, this.org.id);
    this.gustoService.postConfigurations(configurationPayload).subscribe((response: GustoConfiguration) => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Your configurations have been saved successfully');
      this.trackingService.trackTimeSpent(Page.ADVANCED_SETTINGS_QBD, this.sessionStartTime);
    }, () => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error while saving your configuration, please try again later');
      });
  }

  save(): void {
    if (this.configurationForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  setupGustoConfiguration() {
    this.configurationForm = this.formBuilder.group({
      email: [this.gustoConfiguration?.emails_selected.length > 0 ? this.gustoConfiguration?.emails_selected : []],
      additionalEmails: [this.gustoConfiguration?.additional_email_options.length > 0 ? this.gustoConfiguration?.additional_email_options : []],
      search: []
    });
  }

  ngOnInit(): void {
    this.setupGustoConfiguration();
  }

}