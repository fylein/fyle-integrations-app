import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OauthRoutingModule } from './oauth-routing.module';
import { OauthComponent } from './oauth.component';
import { OauthTravelperkComponent } from './oauth-travelperk/oauth-travelperk.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    OauthComponent,
    OauthTravelperkComponent
  ],
  imports: [
    CommonModule,
    OauthRoutingModule,
    SharedModule
  ]
})
export class OauthModule { }
