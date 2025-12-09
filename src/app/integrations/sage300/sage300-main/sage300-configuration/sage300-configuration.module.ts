import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300SharedModule } from '../../sage300-shared/sage300-shared.module';
import { Sage300ConfigurationRoutingModule } from './sage300-configuration-routing.module';
import { Sage300ConfigurationComponent } from './sage300-configuration.component';

@NgModule({
  declarations: [Sage300ConfigurationComponent],
  imports: [CommonModule, Sage300SharedModule, Sage300ConfigurationRoutingModule],
})
export class Sage300ConfigurationModule {}
