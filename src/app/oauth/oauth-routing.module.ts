import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OauthComponent } from './oauth.component';
import { OauthTravelperkComponent } from './oauth-travelperk/oauth-travelperk.component';

const routes: Routes = [
  {
    path: '',
    component: OauthComponent,
    children: [
      {
        path: 'travelperk',
        component: OauthTravelperkComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OauthRoutingModule { }
