import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sage300ExportLogRoutingModule } from './sage300-export-log-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedModule as PrimeNGSharedModule } from 'primeng/api';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    PrimeNGSharedModule,
    Sage300ExportLogRoutingModule
  ]
})
export class Sage300ExportLogModule { }
