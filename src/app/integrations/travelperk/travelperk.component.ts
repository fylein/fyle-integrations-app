import { Component, OnInit } from '@angular/core';
import { RedirectLink } from 'src/app/core/models/enum/enum.model';
import { WindowService } from 'src/app/core/services/core/window.service';

@Component({
  selector: 'app-travelperk',
  templateUrl: './travelperk.component.html',
  styleUrls: ['./travelperk.component.scss']
})
export class TravelperkComponent implements OnInit {
  RedirectLink = RedirectLink;

  showErrorScreen: boolean;

  constructor(
    public windowService: WindowService
  ) { }

  ngOnInit(): void {
  }

}
