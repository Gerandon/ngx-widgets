import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideEnvironmentNgxMask} from "ngx-mask";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideEnvironmentNgxMask(),
    provideAnimationsAsync(),
    {
      provide: NGX_WIDGETS_VALIDATION_TRANSLATIONS,
      useValue: {
        required: 'This field is requiredaa!',
        globalValidationMessage: 'Teeeszt',
        selectGlobalPlaceholder: 'Please choose one from the existing options!'
      }
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill',
        color: 'primary'
      }
    }
  ]
};
