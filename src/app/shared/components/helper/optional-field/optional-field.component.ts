import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-optional-field',
    templateUrl: './optional-field.component.html',
    styleUrls: ['./optional-field.component.scss'],
    standalone: false
})
export class OptionalFieldComponent implements OnInit {

  @Input() noSpacing: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
