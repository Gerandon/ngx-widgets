import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideEnvironmentNgxMask} from "ngx-mask";
import {NGX_WIDGETS_VALIDATION_TRANSLATIONS, NGX_WIDGETS_FORM_FIELD_APPEARANCE} from "@gerandon/ngx-widgets";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideEnvironmentNgxMask(),
    provideAnimationsAsync(),
    {
      provide: NGX_WIDGETS_VALIDATION_TRANSLATIONS,
      useValue: {
        required: 'This field is required!',
        selectGlobalPlaceholder: 'Please choose one from the existing options!'
      }
    },
    {
      provide: NGX_WIDGETS_FORM_FIELD_APPEARANCE,
      useValue: 'fill'
    }
  ]
};
