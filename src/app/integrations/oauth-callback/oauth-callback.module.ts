import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OauthCallbackRoutingModule } from './oauth-callback-routing.module';
import { OauthCallbackComponent } from './oauth-callback.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    OauthCallbackComponent
  ],
  imports: [
    CommonModule,
    OauthCallbackRoutingModule,
    SharedModule
  ]
})
export class OauthCallbackModule { }
