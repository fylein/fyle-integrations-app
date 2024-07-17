import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as Sentry from "@sentry/angular";

if (environment.production) {
  enableProdMode();
}


Sentry.init({
  dsn: "https://a2a46483eabc1b84420e4226a539daa5@o341960.ingest.us.sentry.io/4507616626933760",

  integrations: [
    // Registers and configures the Tracing integration,
    // Which automatically instruments your application to monitor its
    // Performance, including custom Angular routing instrumentation
    Sentry.browserTracingIntegration(),
    // Registers the Replay integration,
    // Which automatically captures Session Replays
    Sentry.replayIntegration()
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // Of transactions for tracing.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
  // eslint-disable-next-line capitalized-comments
  // tracePropagationTargets: ["localhost", 'staging.fyle.tech', 'app.fylehq.com'],

  // Capture Replay for 10% of all sessions,
  // Plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
