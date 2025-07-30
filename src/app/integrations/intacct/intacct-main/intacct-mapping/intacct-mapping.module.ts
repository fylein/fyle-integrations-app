import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntacctMappingRoutingModule } from './intacct-mapping-routing.module';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { IntacctMappingComponent } from './intacct-mapping.component';
import { IntacctBaseMappingComponent } from './intacct-base-mapping/intacct-base-mapping.component';


@NgModule({
  declarations: [
    IntacctMappingComponent,
    IntacctBaseMappingComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    TabsModule,
    SharedModule,
    IntacctMappingRoutingModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class IntacctMappingModule { }
