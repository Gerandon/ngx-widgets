import {
  AfterViewInit,
  Directive, Inject, inject, InjectionToken,
  Input, OnChanges,
  OnInit, Optional, SimpleChanges,
  input, signal
} from '@angular/core';
import {FloatLabelType, MatFormFieldAppearance, SubscriptSizing} from '@angular/material/form-field';

import {BaseValueAccessor} from './base-value-accessor';
import {isEmpty, keys} from 'lodash-es';

export interface NgxWidgetsValidationErrorTypes {
  required?: string;
  selectGlobalPlaceholder?: string;
}

export const NGX_WIDGETS_VALIDATION_TRANSLATIONS = new InjectionToken<NgxWidgetsValidationErrorTypes>('NGX_WIDGETS_VALIDATION_TRANSLATIONS');
export const NGX_WIDGETS_FORM_FIELD_APPEARANCE = new InjectionToken<MatFormFieldAppearance>('NGX_WIDGETS_FORM_FIELD_APPEARANCE');

@Directive()
export class BaseInput<T> extends BaseValueAccessor<T> implements OnInit, AfterViewInit, OnChanges {

  protected readonly appearance = input<MatFormFieldAppearance>();
  // Used on Template
  protected readonly _appearance = signal<MatFormFieldAppearance>('outline');
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() public id!: string;
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() public name!: string;
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() public label!: string;
  public readonly translateParams = input<unknown>();
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() public placeholder!: string;
  public readonly isDisabled = input<boolean | undefined>(false);
  public readonly floatLabel = input<FloatLabelType>('auto');
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input() public prefixIcon?: string;
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input() public suffixIcon?: string;
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input() public suffix?: string;
  public readonly formControlName = input<string>();
  public readonly validatorMessages = input<{
    [key: string]: string;
  }>();
  public readonly subscriptSizing = input<SubscriptSizing>('fixed');
  public readonly hintLabel = input('');
  public validatorMessagesArray: { key: string, value: unknown }[] = [];

  constructor(@Optional() @Inject(NGX_WIDGETS_VALIDATION_TRANSLATIONS) protected readonly validationTranslations: NgxWidgetsValidationErrorTypes | any = {},
              @Optional() @Inject(NGX_WIDGETS_FORM_FIELD_APPEARANCE) protected readonly formFieldAppearance: MatFormFieldAppearance) {
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

    if (this.formFieldAppearance && !this.appearance()) {
      this._appearance.set(this.formFieldAppearance);
    }
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
