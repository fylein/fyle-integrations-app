import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';

@Component({
  selector: 'app-netsuite-custome-segment-dialog',
  templateUrl: './netsuite-custome-segment-dialog.component.html',
  styleUrls: ['./netsuite-custome-segment-dialog.component.scss']
})
export class NetsuiteCustomeSegmentDialogComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() isLoading: boolean;

  @Input() options: SelectFormOption[];

  @Output() saveClick = new EventEmitter();

  isSave: boolean = false;

  constructor() { }

  save() {
    this.saveClick.emit();
  }

  ngOnInit(): void {
  }

}
