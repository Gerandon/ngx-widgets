import {
  Directive,
  input
} from '@angular/core';

import { BaseInput } from './base-input';

@Directive()
export class BaseTextInput<T, ANNOUNCER_TYPE = object> extends BaseInput<T, ANNOUNCER_TYPE> {

  public readonly type = input<('text' | 'password' | 'number' | 'email' | 'tel')>('text');
  public readonly maxLength = input<number | undefined>(512);
}
