import { APP_INITIALIZER, ErrorHandler, isDevMode, NgModule } from '@angular/core';
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
import { ThemeService } from '../core/services/theme.service';
import { Sage300ConfigurationModule } from './integrations/sage300/sage300-main/sage300-configuration/sage300-configuration.module';

import * as Sentry from "@sentry/angular";
import { Router } from '@angular/router';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { TranslocoHttpLoader } from './transloco-http-loader';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/aura';

const sagePreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#f2f9f6',
      100: '#cce6da',
      200: '#bsd9c8',
      300: '#008146',
      400: '#008146',
      500: '#008146',
      600: '#006738',
      700: '#004d2a',
      800: '#004d2a',
      900: '#004d2a',
      950: '#004d2a'
    }
  },
  components: {
    button: {
      root: {
        primary: {
          background: '#008146',
          color: '#fff'
        },
        borderRadius: '24px',
        paddingY: '16px',
        paddingX: '8px'
      }
    }
  }
});

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

        // PrimeNG theming handled by ThemeService initialization
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Lara,
                options: {
                    darkModeSelector: false,
                    cssLayer: false
                    }
                }
        }),
        provideTransloco({
            config: {
                availableLangs: ['en'],
                defaultLang: 'en',
                reRenderOnLangChange: true,
                prodMode: !isDevMode()
            },
            loader: TranslocoHttpLoader
        }),
        provideTranslocoMessageformat(),
        {
            provide: APP_INITIALIZER,
            useFactory: (transloco: TranslocoService) => {
                return () =>
                firstValueFrom(transloco.load('en')).then(() => {
                    transloco.setActiveLang('en');
                });
            },
            deps: [TranslocoService],
            multi: true
        },
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

        // Initialize branding and theme services
        {
            provide: APP_INITIALIZER,
            useFactory: (brandingService: BrandingService, themeService: ThemeService) => {
                return () => {
                    // Initialize branding first
                    brandingService.init();

                    // Theme service will automatically initialize based on branding config
                    // No additional initialization needed since it reads from brandingConfig

                    return Promise.resolve();
                };
            },
            deps: [BrandingService, ThemeService, Sentry.TraceService],
            multi: true
        },

        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
