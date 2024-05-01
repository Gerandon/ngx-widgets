import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {NGX_WIDGETS_VALIDATION_TRANSLATIONS} from "../../../ngx-widgets/src/lib/core/base-input";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: NGX_WIDGETS_VALIDATION_TRANSLATIONS,
      useValue: {
        required: 'This field is required!',
        selectGlobalPlaceholder: 'Please choose one from the existing options!'
      }
    }
  ]
};
