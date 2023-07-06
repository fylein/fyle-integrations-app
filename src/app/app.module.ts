import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// External Libraries
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { GlobalErrorHandler } from './app.error-handling';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

import { FyleIntegrationsSharedModule } from 'fyle-integrations-ui-lib';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastModule,
    RippleModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' }),
    FyleIntegrationsSharedModule
  ],
  providers: [
    MessageService,
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS
    },
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
