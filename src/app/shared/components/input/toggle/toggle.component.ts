import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingContent } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() formControllerName: string;

  @Input() isDisabled: boolean;

  @Input() toolTipText: string = '';

  @Output() toggleChange = new EventEmitter();

  @Output() toggleClick = new EventEmitter();

  constructor() { }

  onToggleChange() {
    this.toggleChange.emit();
  }

  onToggleClick() {
    this.toggleClick.emit();
  }

  ngOnInit(): void {
  }

}
