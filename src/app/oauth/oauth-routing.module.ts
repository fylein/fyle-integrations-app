import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OauthComponent } from './oauth.component';
import { OauthTravelperkComponent } from './oauth-travelperk/oauth-travelperk.component';
import { OauthDefaultComponent } from './oauth-default/oauth-default.component';

const routes: Routes = [
  {
    path: '',
    component: OauthComponent,
    children: [
      {
        path: 'travelperk',
        component: OauthTravelperkComponent,
      },
      {
        path: 'default',
        component: OauthDefaultComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OauthRoutingModule {}
