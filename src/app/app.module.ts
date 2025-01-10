import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// External Libraries
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { GlobalErrorHandler } from './app.error-handling';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SharedModule } from './shared/shared.module';
import { RippleModule } from 'primeng/ripple';
import { BrandingService } from './core/services/common/branding.service';
import { Sage300ConfigurationModule } from './integrations/sage300/sage300-main/sage300-configuration/sage300-configuration.module';

import * as Sentry from "@sentry/angular";
import { Router } from '@angular/router';

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ToastModule,
        SharedModule,
        RippleModule,
        IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' }),
        Sage300ConfigurationModule], providers: [
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
        },
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler()
        },
        {
            provide: Sentry.TraceService,
            deps: [Router]
        },
        {
            provide: APP_INITIALIZER,
            useFactory: (brandingService: BrandingService) => () => brandingService.init(),
            deps: [BrandingService, Sentry.TraceService],
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
