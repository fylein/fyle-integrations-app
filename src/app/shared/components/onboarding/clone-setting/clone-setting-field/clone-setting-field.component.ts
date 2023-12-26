import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-clone-setting-field',
  templateUrl: './clone-setting-field.component.html',
  styleUrls: ['./clone-setting-field.component.scss']
})
export class CloneSettingFieldComponent implements OnInit {

  @Input() label: string;

  @Input() iconSource: string;

  constructor() { }

  ngOnInit(): void {
  }

}
