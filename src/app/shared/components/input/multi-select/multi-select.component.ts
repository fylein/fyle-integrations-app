import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit{

  @Input() form: FormGroup;

  @Input() formControllerName: string;

  @Input() disabledOption: string;

  @Input() placeholder: string;

  @Input() options: any[];

  @Input() optionLabel: string;

  @Input() displayAs: string;

  @Input() isFilter: boolean = false;

  @Input() filterBy: string;

  @Input() isFieldMandatory: boolean = false;

  @Input() selectedValue: string | null;

  @Output() multiSelectChange = new EventEmitter();

  @Output() removeItem = new EventEmitter();

  readonly brandingConfig = brandingConfig;

  constructor() { }

  onMultiSelectChange(value: any) {
    this.multiSelectChange.emit();
  }

  removeIconClick() {
    this.removeItem.emit();
  }

  isOverflowing(element: any): boolean {
    return element.offsetWidth < element.scrollWidth;
  }

  ngOnInit(): void {}

}
