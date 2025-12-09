import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OauthRoutingModule } from './oauth-routing.module';
import { OauthComponent } from './oauth.component';
import { OauthTravelperkComponent } from './oauth-travelperk/oauth-travelperk.component';
import { SharedModule } from '../shared/shared.module';
import { OauthDefaultComponent } from './oauth-default/oauth-default.component';

@NgModule({
  declarations: [OauthComponent, OauthTravelperkComponent, OauthDefaultComponent],
  imports: [CommonModule, OauthRoutingModule, SharedModule],
})
export class OauthModule {}
