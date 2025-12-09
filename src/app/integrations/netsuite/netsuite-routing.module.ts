import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetsuiteComponent } from './netsuite.component';
import { NetsuiteTokenGuard } from 'src/app/core/guard/netsuite-token.guard';

const routes: Routes = [
  {
    path: '',
    component: NetsuiteComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: () =>
          import('./netsuite-onboarding/netsuite-onboarding.module').then((m) => m.NetsuiteOnboardingModule),
      },
      {
        path: 'main',
        loadChildren: () => import('./netsuite-main/netsuite-main.module').then((m) => m.NetsuiteMainModule),
        canActivate: [NetsuiteTokenGuard],
      },
      {
        path: 'token_expired',
        loadChildren: () => import('./netsuite-main/netsuite-main.module').then((m) => m.NetsuiteMainModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetsuiteRoutingModule {}
