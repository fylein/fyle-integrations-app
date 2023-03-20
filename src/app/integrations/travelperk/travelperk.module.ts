import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelperkRoutingModule } from './travelperk-routing.module';
import { TravelperkComponent } from './travelperk.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';


@NgModule({
  declarations: [
    TravelperkComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TravelperkRoutingModule,
    SkeletonModule
  ]
})
export class TravelperkModule { }
