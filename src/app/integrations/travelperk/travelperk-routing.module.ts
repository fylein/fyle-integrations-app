import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelperkComponent } from './travelperk.component';
import { TravelperkTokenGuard } from 'src/app/core/guard/travelperk-token.guard';

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
        loadChildren: () => import('./travelperk-main/travelperk-main.module').then(m => m.TravelperkMainModule),
        canActivate: [TravelperkTokenGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelperkRoutingModule { }
