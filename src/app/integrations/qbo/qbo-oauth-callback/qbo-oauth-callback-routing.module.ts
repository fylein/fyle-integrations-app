import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QboOauthCallbackComponent } from './qbo-oauth-callback.component';

const routes: Routes = [
  {
    path: '',
    component: QboOauthCallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QboOauthCallbackRoutingModule { }
