import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FyleIntegrationsSharedModule } from 'fyle-integrations-ui-lib';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RedirectComponent } from './redirect/redirect.component';
import { IntegrationsSettingsSharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RedirectComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IntegrationsSettingsSharedModule,
    FyleIntegrationsSharedModule
  ]
})
export class AuthModule { }
