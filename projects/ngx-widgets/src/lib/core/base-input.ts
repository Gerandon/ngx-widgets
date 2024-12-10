import {
  AfterViewInit,
  Directive, Inject, inject, InjectionToken,
  Input, OnChanges,
  OnInit, Optional, SimpleChanges,
  input
} from '@angular/core';
import {FloatLabelType, SubscriptSizing} from '@angular/material/form-field';

import {BaseValueAccessor} from './base-value-accessor';
import {isEmpty, keys} from 'lodash-es';

export interface NgxWidgetsValidationErrorTypes {
  required?: string;
  selectGlobalPlaceholder?: string;
}

export const NGX_WIDGETS_VALIDATION_TRANSLATIONS = new InjectionToken<NgxWidgetsValidationErrorTypes>('NGX_WIDGETS_VALIDATION_TRANSLATIONS');

@Directive()
export class BaseInput<T> extends BaseValueAccessor<T> implements OnInit, AfterViewInit, OnChanges {

  @Input() public id!: string;
  @Input() public name!: string;
  @Input() public label!: string;
  public readonly translateParams = input<unknown>();
  @Input() public placeholder!: string;
  public readonly isDisabled = input<boolean | undefined>(false);
  public readonly floatLabel = input<FloatLabelType>('auto');
  @Input() public prefixIcon?: string;
  @Input() public suffixIcon?: string;
  @Input() public suffix?: string;
  public readonly formControlName = input<string>();
  public readonly validatorMessages = input<{
    [key: string]: string;
  }>();
  public readonly subscriptSizing = input<SubscriptSizing>('fixed');
  public readonly hintLabel = input('');
  public validatorMessagesArray: { key: string, value: unknown }[] = [];

  constructor(@Optional() @Inject(NGX_WIDGETS_VALIDATION_TRANSLATIONS) protected readonly validationTranslations: NgxWidgetsValidationErrorTypes | any = {}) {
    super();
  }

  ngOnInit() {
    this.placeholder = this.placeholder === undefined ? this.label : this.placeholder;
    if (!this.name) {
      this.name = this.formControlName()!;
      /*
      console.warn(`name attribute is not defined for ${this.formControlName}! Please beware, that using this control multiple
      times with the same control name could result in wrong focus, clicking on the label!`);
       */
    }
    // *ngIf seems like does not re-render component when label is used with dynamic value (e.g.: translate pipe). Strange
    this.label = this.label || ' ';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['validatorMessages']) {
      const validatorMessages = this.validatorMessages();
      if (!isEmpty(validatorMessages)) {
        this.validatorMessagesArray = keys(validatorMessages).map((key) => ({
          key,
          value: this.validatorMessages()![key],
        }));
      }
    }
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.cdr.detectChanges();
  }
}
