import {
  AfterViewInit,
  ChangeDetectorRef, Directive,
  ElementRef, inject,
  Injector, OnDestroy, Type,
  ViewChild,
  input
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormControl,
  NgControl,
  ValidationErrors,
  Validator, ValidatorFn,
} from '@angular/forms';

import {Observable, of, Subject} from 'rxjs';

@Directive()
export class BaseValueAccessor<T> implements ControlValueAccessor, AfterViewInit, Validator, OnDestroy {

  public readonly validator = input<Observable<ValidationErrors>>(of({}));
  @ViewChild('inputElement') inputElement!: ElementRef;
  @ViewChild('input') input!: NgControl;

  public control: FormControl;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (value: T) => {
  };
  private onTouched = () => {
  };
  private readonly injector: Injector = inject(Injector);
  protected controlDir!: NgControl;
  protected readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected _validate: ValidatorFn;
  protected readonly _defaultValidate: ValidatorFn = () => null;

  protected readonly destroy$ = new Subject<void>();

  constructor() {
    this._validate = this._defaultValidate;
    // Temporarily, AfterViewInit will handle the correct setting
    this.control = new FormControl();
  }

  validate(control: AbstractControl): Observable<ValidationErrors> {
    control.setErrors({ ...control.errors, pending: true });
    return this.validator();
  }

  ngAfterViewInit() {
    this.controlDir = this.injector.get<NgControl>(NgControl as Type<NgControl>);
    this.control = <FormControl>this.controlDir.control;
    // For ng-valid expression changed error workaround purposes
    this.cdr.detectChanges();
  }

  writeValue(obj: T): void {
    this.valueAccessor?.writeValue(obj);
  }

  registerOnChange(fn: (value: T) => unknown): void {
    this.onChange = fn;
    this.valueAccessor?.registerOnChange(fn);
  }

  registerOnTouched(fn: () => unknown) {
    this.onTouched = fn;
    this.valueAccessor?.registerOnTouched(fn);
  }

  protected get valueAccessor(): ControlValueAccessor | null {
    return this.input ? this.input.valueAccessor : null;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
