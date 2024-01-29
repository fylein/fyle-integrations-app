import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent implements OnInit {

  @Input() svgSource: string;

  @Input() width: string;

  @Input() height: string;

  @Input() styleClasses: string;

  @Input() tooltipPosition: string = 'top';

  @Input() tooltipText: string;

  @Output() iconClick = new EventEmitter();

  constructor() { }

  iconClickEvent() {
    this.iconClick.emit();
  }

  ngOnInit(): void {
  }

}
