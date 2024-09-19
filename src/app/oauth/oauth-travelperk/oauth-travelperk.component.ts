import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { ActivatedRoute } from '@angular/router';
import type { TravelperkService } from 'src/app/core/services/travelperk/travelperk.service';

@Component({
  selector: 'app-oauth-travelperk',
  templateUrl: './oauth-travelperk.component.html',
  styleUrls: ['./oauth-travelperk.component.scss']
})
export class OauthTravelperkComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private travelPerkService: TravelperkService
  ) { }

  private connectTravelperk(): void {
    this.route.queryParams.subscribe(params => {
      if (params.code && params.state) {
        this.travelPerkService.connect(params.code, params.state).subscribe(() => {
          window.close();
        });
      }
    });
  }

  ngOnInit(): void {
    this.connectTravelperk();
  }

}
