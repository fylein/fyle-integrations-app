import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XeroComponent } from './xero.component';
import { XeroTokenGuard } from 'src/app/core/guard/xero-token.guard';

const routes: Routes = [
  {
    path: '',
    component: XeroComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: () => import('./xero-onboarding/xero-onboarding.module').then(m => m.XeroOnboardingModule)
      },
      {
        path: 'main',
        loadChildren: () => import('./xero-main/xero-main.module').then(m => m.XeroMainModule),
        canActivate: [XeroTokenGuard]
      },
      {
        path: 'token-expired',
        loadChildren: () => import('./xero-main/xero-main.module').then(m => m.XeroMainModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XeroRoutingModule { }
