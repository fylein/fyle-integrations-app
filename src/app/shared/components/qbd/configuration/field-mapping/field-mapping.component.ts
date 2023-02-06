import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { QBDConfigurationCtaText, QBDRepresentation } from 'src/app/core/models/enum/enum.model';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';

@Component({
  selector: 'app-field-mapping',
  templateUrl: './field-mapping.component.html',
  styleUrls: ['./field-mapping.component.scss']
})
export class FieldMappingComponent implements OnInit {

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) { }

  isLoading: boolean;

  saveInProgress: boolean;

  fieldMappingForm: FormGroup;

  isOnboarding: boolean = true;

  ConfigurationCtaText = QBDConfigurationCtaText;

  representationOption: QBDExportSettingFormOption[] = [
    {
      label: 'Project',
      value: QBDRepresentation.PROJECT
    },
    {
      label: 'Cost Center',
      value: QBDRepresentation.COST_CENTER
    },
    {
      label: 'Select type custom field',
      value: QBDRepresentation.CUSTOME_FIELD
    }
  ];

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

  save() {
    const a = 'sss';
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.fieldMappingForm = this.formBuilder.group({
      representClass: [null],
      representCustomer: [null]
        });
    // This.fieldMappingService.getQbdFieldMapping().subscribe((fielsMappingResponse : QBDFieldMappingGet) => {
    //   This.fieldMapping = fielsMappingResponse;
    //   This.fieldMappingForm = this.formBuilder.group({
      // RepresentClass: [this.fieldMapping?.class_type ? this.fieldMapping?.class_type : null, Validators.required],
      // RepresentCustomer: [this.fieldMapping?.project_type ? this.fieldMapping?.project_type : null, Validators.required]
    //   });
    //   This.isLoading = false;
    // }, () => {
    //     This.fieldMappingForm = this.formBuilder.group({
            // RepresentClass: [null],
            // RepresentCustomer: [null]
            //   });
    //     This.isLoading = false;
    //   }
    // );
  }


}
