import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'integrations',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'oauth',
    loadChildren: () => import('./oauth/oauth.module').then((m) => m.OauthModule),
  },
  {
    path: 'integrations',
    loadChildren: () => import('./integrations/integrations.module').then((m) => m.IntegrationsModule),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'integrations',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
