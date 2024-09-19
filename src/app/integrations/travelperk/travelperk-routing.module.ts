import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TravelperkComponent } from './travelperk.component';

const routes: Routes = [
  {
    path: '',
    component: TravelperkComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: () => import('./travelperk-onboarding/travelperk-onboarding.module').then(m => m.TravelperkOnboardingModule)
      },
      {
        path: 'main',
        loadChildren: () => import('./travelperk-main/travelperk-main.module').then(m => m.TravelperkMainModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelperkRoutingModule { }
