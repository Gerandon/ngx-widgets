import {
  AfterViewInit,
  Directive, Inject, inject, InjectionToken,
  Input, OnChanges,
  OnInit, Optional, SimpleChanges,
  input, signal, WritableSignal
} from '@angular/core';
import {
  FloatLabelType,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldAppearance,
  SubscriptSizing
} from '@angular/material/form-field';

import {BaseValueAccessor} from './base-value-accessor';
import {isEmpty, keys} from 'lodash-es';
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {ThemePalette} from "@angular/material/core";
import {debounceTime, startWith, takeUntil} from "rxjs";

export interface NgxWidgetsValidationErrorTypes {
  required?: string;
  selectGlobalPlaceholder?: string;
}

export const NGX_WIDGETS_VALIDATION_TRANSLATIONS = new InjectionToken<NgxWidgetsValidationErrorTypes>('NGX_WIDGETS_VALIDATION_TRANSLATIONS');
/**
 * @deprecated
 * This token is deprecated and will be removed in Angular v21. Use MAT_FORM_FIELD_DEFAULT_OPTIONS instead.
 */
export const NGX_WIDGETS_FORM_FIELD_APPEARANCE = new InjectionToken<MatFormFieldAppearance>('NGX_WIDGETS_FORM_FIELD_APPEARANCE');

@Directive()
export class BaseInput<T, ANNOUNCER_TYPE = object> extends BaseValueAccessor<T> implements OnInit, AfterViewInit, OnChanges {

  public readonly appearance = input<MatFormFieldAppearance>();
  protected readonly _appearance: WritableSignal<MatFormFieldAppearance>;
  public readonly color = input<ThemePalette>();
  protected readonly _color: WritableSignal<ThemePalette>;
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
  public readonly ariaLabel = input('', { alias: 'aria-label' });
  public readonly ariaPlaceholder = input('', { alias: 'aria-placeholder' });
  public readonly ariaDescribedBy = input('', { alias: 'aria-describedby' });
  public readonly ariaDescription = input('', { alias: 'aria-description' });
  protected controlErrorKeys: string[] = [];
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly matFormFieldConfig = inject(MAT_FORM_FIELD_DEFAULT_OPTIONS);
  public readonly announcerTranslations = input<ANNOUNCER_TYPE>();
  public validatorMessagesArray: { key: string, value: unknown }[] = [];
  protected _defaultAnnouncerTranslations?: { [P in keyof ANNOUNCER_TYPE]-?: ANNOUNCER_TYPE[P] };

  constructor(@Optional() @Inject(NGX_WIDGETS_VALIDATION_TRANSLATIONS) protected readonly validationTranslations: NgxWidgetsValidationErrorTypes | any = {}) {
    super();
    this._appearance = signal<MatFormFieldAppearance>(this.matFormFieldConfig.appearance ?? 'fill');
    this._color = signal<ThemePalette>(this.matFormFieldConfig.color ?? 'primary');
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
    this.control.statusChanges.pipe(
      startWith(this.control.status),
      takeUntil(this.destroy$),
      debounceTime(100),
    ).subscribe(() => {
      if (!this.control.hasError('server')) {
        this.controlErrorKeys = keys(this.control.errors).map((key) => key);
        this.cdr.detectChanges();
      }
    });
  }

  protected announce(key: keyof ANNOUNCER_TYPE | string) {
    if (this._defaultAnnouncerTranslations?.[key as keyof ANNOUNCER_TYPE]) {
      const _key = key as keyof ANNOUNCER_TYPE
      const inputTranslation = this.announcerTranslations()?.[_key] as string;
      if (inputTranslation) {
        return this.liveAnnouncer.announce(inputTranslation, 'assertive');
      } else {
        return this.liveAnnouncer.announce(this._defaultAnnouncerTranslations![_key] as string, 'assertive');
      }
    } else {
      return this.liveAnnouncer.announce(key as string, 'assertive');
    }
  }
}
