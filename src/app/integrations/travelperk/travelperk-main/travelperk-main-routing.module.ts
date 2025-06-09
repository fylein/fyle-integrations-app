import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelperkMainComponent } from './travelperk-main.component';

const routes: Routes = [
  {
    path: '',
    component: TravelperkMainComponent,
    children: [
      {
        path: '',
        redirectTo: 'configuration',
        pathMatch: 'full'
      },
      {
        path: 'configuration',
        loadChildren: () => import('./travelperk-configuration/travelperk-configuration.module').then(m => m.TravelperkConfigurationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelperkMainRoutingModule { }
