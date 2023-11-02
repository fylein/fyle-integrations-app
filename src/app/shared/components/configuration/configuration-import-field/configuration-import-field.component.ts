import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { InputSwitchOnChangeEvent } from 'primeng/inputswitch';
import { IntegrationFields } from 'src/app/core/models/db/mapping.model';
import { sage300DefaultFields } from 'src/app/core/models/sage300/sage300-configuration/sage300-import-settings.model';
import { MappingSetting } from 'src/app/core/models/si/si-configuration/import-settings.model';

@Component({
  selector: 'app-configuration-import-field',
  templateUrl: './configuration-import-field.component.html',
  styleUrls: ['./configuration-import-field.component.scss']
})
export class ConfigurationImportFieldComponent implements OnInit {

  @Input() appName: string = 'Sage 300 CRE';

  @Input() form: FormGroup;

  @Input() accountingFieldOptions: IntegrationFields[];

  @Input() fyleFieldOptions: IntegrationFields[];

  @Input() showTaxGroupDropdown: boolean;

  @Input() defaultFields: sage300DefaultFields[];


  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
  }

}
