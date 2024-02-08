import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportLogRoutingModule } from './export-log-routing.module';
import { ExportLogComponent } from './export-log.component';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { DialogModule } from 'primeng/dialog';
import { TabMenuModule } from 'primeng/tabmenu';
import { SkipExportLogComponent } from './skip-export-log/skip-export-log.component';
import { CompletedExportLogComponent } from './completed-export-log/completed-export-log.component';


@NgModule({
  declarations: [
    ExportLogComponent,
    SkipExportLogComponent,
    CompletedExportLogComponent
  ],
  imports: [
    TabMenuModule,
    DialogModule,
    SharedModule,
    CommonModule,
    ExportLogRoutingModule,
    TableModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class ExportLogModule { }
