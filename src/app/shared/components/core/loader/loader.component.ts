import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input() styleClass: string = '!tw-w-50-px !tw-h-50-px spinner-default';

  constructor() { }

  ngOnInit(): void {
  }

}
