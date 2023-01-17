import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationAdvancedSettingComponent } from './configuration-advanced-setting/configuration-advanced-setting.component';
import { ConfigurationFieldSettingComponent } from './configuration-field-setting/configuration-field-setting.component';
import { ConfigurationExportSettingComponent } from './configuration-export-setting/configuration-export-setting.component';


@NgModule({
  declarations: [
    ConfigurationAdvancedSettingComponent,
    ConfigurationFieldSettingComponent,
    ConfigurationExportSettingComponent
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    SharedModule
  ]
})
export class ConfigurationModule { }
