import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RedirectLink } from 'src/app/core/models/enum/enum.model';
import { WindowService } from 'src/app/core/services/core/window.service';

@Component({
  selector: 'app-app-landing',
  templateUrl: './app-landing.component.html',
  styleUrls: ['./app-landing.component.scss']
})
export class AppLandingComponent implements OnInit {
  @Output() openReadMore = new EventEmitter<void>();

  @Input() appName: string;

  @Input() svgPath: string;

  RedirectLink = RedirectLink;

  constructor(
    public windowService: WindowService
  ) { }

  openHelp(){
    this.openReadMore.emit();
  }

  ngOnInit(): void {
  }

}
