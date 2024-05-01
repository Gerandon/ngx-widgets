import {
  Directive,
  Input,
} from '@angular/core';

import { BaseInput } from './base-input';

@Directive()
export class BaseTextInput<T> extends BaseInput<T> {

  @Input() public type: ('text' | 'password' | 'number' | 'email' | 'tel') = 'text';
  @Input() public maxLength? = 512;
}
