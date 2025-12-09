import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300MainRoutingModule } from './sage300-main-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedModule as PrimeNGSharedModule } from 'primeng/api';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, PrimeNGSharedModule, Sage300MainRoutingModule],
})
export class Sage300MainModule {}
