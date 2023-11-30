import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sage300ExportLogRoutingModule } from './sage300-export-log-routing.module';
<<<<<<< HEAD
=======
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedModule as PrimeNGSharedModule } from 'primeng/api';

>>>>>>> master


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
<<<<<<< HEAD
=======
    SharedModule,
    PrimeNGSharedModule,
>>>>>>> master
    Sage300ExportLogRoutingModule
  ]
})
export class Sage300ExportLogModule { }
