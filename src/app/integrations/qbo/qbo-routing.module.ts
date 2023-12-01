import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QboComponent } from './qbo.component';
import { QboTokenGuard } from 'src/app/core/guard/qbo-token.guard';

const routes: Routes = [
  {
    path: '',
    component: QboComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: () => import('./qbo-onboarding/qbo-onboarding.module').then(m => m.QboOnboardingModule)
      },
      {
        path: 'main',
        loadChildren: () => import('./qbo-main/qbo-main.module').then(m => m.QboMainModule),
        canActivate: [QboTokenGuard]
      },
      {
        path: 'oauth_callback',
        loadChildren: () => import('./qbo-oauth-callback/qbo-oauth-callback.module').then(m => m.QboOauthCallbackModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QboRoutingModule { }
