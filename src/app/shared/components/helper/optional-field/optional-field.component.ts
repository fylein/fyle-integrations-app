import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-optional-field',
  templateUrl: './optional-field.component.html',
  styleUrls: ['./optional-field.component.scss']
})
export class OptionalFieldComponent implements OnInit {

  @Input() noSpacing: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
