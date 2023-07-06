import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'fyle-integrations-ui-lib';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'integrations',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'integrations',
    loadChildren: () => import('./integrations/integrations.module').then(m => m.IntegrationsModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'integrations',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
