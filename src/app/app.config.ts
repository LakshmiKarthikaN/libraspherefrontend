import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';   // ← ADD
import  Aura  from '@primeng/themes/aura';        // ← ADD
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    providePrimeNG({                                // ← ADD
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false   // disable auto dark mode
        }
      }
    })
  ]
};