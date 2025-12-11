import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk-core/travelperk.service';

@Component({
    selector: 'app-oauth-travelperk',
    templateUrl: './oauth-travelperk.component.html',
    styleUrls: ['./oauth-travelperk.component.scss'],
    standalone: false
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
