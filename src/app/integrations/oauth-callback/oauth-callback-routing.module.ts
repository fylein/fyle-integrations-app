import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OauthCallbackComponent } from './oauth-callback.component';

const routes: Routes = [
  {
    path: '',
    component: OauthCallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OauthCallbackRoutingModule { }
