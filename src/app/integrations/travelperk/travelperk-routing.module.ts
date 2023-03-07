import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelperkComponent } from './travelperk.component';

const routes: Routes = [{ path: '', component: TravelperkComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelperkRoutingModule { }
