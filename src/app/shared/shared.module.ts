import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/core/loader/loader.component';
import { AppHeaderComponent } from './components/apps/app-header/app-header.component';

// External Libraries
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';


@NgModule({
  declarations: [
    LoaderComponent,
    AppHeaderComponent
  ],
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    ButtonModule,
    TooltipModule,
    SkeletonModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ],
  exports: [
    LoaderComponent,
    AppHeaderComponent
  ]
})
export class SharedModule { }
