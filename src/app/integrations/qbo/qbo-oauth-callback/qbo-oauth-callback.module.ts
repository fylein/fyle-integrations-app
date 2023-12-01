import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QboOauthCallbackRoutingModule } from './qbo-oauth-callback-routing.module';
import { QboOauthCallbackComponent } from './qbo-oauth-callback.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    QboOauthCallbackComponent
  ],
  imports: [
    CommonModule,
    QboOauthCallbackRoutingModule,
    SharedModule
  ]
})
export class QboOauthCallbackModule { }
