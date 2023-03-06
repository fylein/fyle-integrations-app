import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RedirectLink } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-app-landing',
  templateUrl: './app-landing.component.html',
  styleUrls: ['./app-landing.component.scss']
})
export class AppLandingComponent implements OnInit {
  @Output() openReadMore = new EventEmitter<void>();

  @Input() headerText: string;

  @Input() svgPath: string;

  RedirectLink = RedirectLink;

  constructor() { }

  openHelp(){
    this.openReadMore.emit();
  }

  ngOnInit(): void {
  }

}
