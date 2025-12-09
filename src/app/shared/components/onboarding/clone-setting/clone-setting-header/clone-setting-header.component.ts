import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-clone-setting-header',
  templateUrl: './clone-setting-header.component.html',
  styleUrls: ['./clone-setting-header.component.scss'],
  standalone: false,
})
export class CloneSettingHeaderComponent implements OnInit {
  @Input() headerText: string;

  @Input() subHeaderText: string;

  constructor() {}

  ngOnInit(): void {}
}
