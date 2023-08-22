import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiComponent } from './si.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { SiRoutingModule } from './si-routing.module';
import { OnboardingImportSettingComponent } from './onboarding/onboarding-import-setting/onboarding-import-setting.component';


@NgModule({
  declarations: [
    SiComponent,
    OnboardingImportSettingComponent
  ],
  imports: [
    CommonModule,
    SiRoutingModule,
    SharedModule,
    TabMenuModule,
    DropdownModule,
    TableModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class SiModule { }
