import {
  Directive,
  input
} from '@angular/core';

import { BaseInput } from './base-input';

@Directive()
export class BaseTextInput<T> extends BaseInput<T> {

  public readonly type = input<('text' | 'password' | 'number' | 'email' | 'tel')>('text');
  public readonly maxLength = input<number | undefined>(512);
}
