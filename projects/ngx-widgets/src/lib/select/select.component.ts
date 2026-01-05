import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
  input, signal
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import {BaseInput} from '../core/base-input';
import { isEqual } from 'lodash-es';
import {first, Observable, Subscription} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

export interface SelectOptionType {
  label: string;
  value: string | number | null | unknown;
}

interface SelectAnnouncerTranslations {
  inputReset?: string;
  asyncLoading?: string;
}

@Component({
  selector: 'gerandon-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: true,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true }
  ],
  imports: [
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatProgressSpinner,
  ],
})
export class SelectComponent extends BaseInput<unknown, SelectAnnouncerTranslations> implements OnInit {

  /**
   * In this case, an empty option appears that resets the control, to an empty value state
   */
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input() public emptyOptionLabel?: string;
  @Input() public emptyOptionAriaLabel?: string = 'Üres';
  public readonly multiple = input<boolean>();
  public readonly options = input<SelectOptionType[]>([]);
  public readonly initialOptionGetFn = input<(controlValue: any) => Observable<SelectOptionType>>();
  public readonly asyncOptions = input<Observable<SelectOptionType[]>>();
  public readonly lazy = input<boolean>(false);
  public readonly optionsLoading = signal(false);
  @ViewChildren('optionElements') public optionElements!: QueryList<ElementRef>;
  protected override _defaultAnnouncerTranslations: { [P in keyof SelectAnnouncerTranslations]-?: SelectAnnouncerTranslations[P] } = {
    inputReset: 'Lenyíló mező törölve!',
    asyncLoading: 'Értékkészlet betöltése a szerverről folyamatban!'
  }
  private lastOptions: SelectOptionType[] = [];
  private __options: SelectOptionType[] = [];
  get _options() {
    return this.__options;
  }
  set _options(value: SelectOptionType[]) {
    this.__options = value;
    if (value.length) {
      this.lastOptions = value;
    }
  }

  /**
   * Angular Material - Select component comparsion is only '===', does not work with Array values
   * https://github.com/angular/components/blob/a07c0758a5ec2eb4de1bb822354be08178c66aa4/src/lib/select/select.ts#L242C48-L242C58
   */
  public readonly _isEqual = isEqual;

  private optionSubscription?: Subscription;

  override ngOnInit() {
    this.placeholder = !this.placeholder ? (this.validationTranslations?.selectGlobalPlaceholder || this.label) : this.placeholder;
    super.ngOnInit();
    this.id = this.id || this.formControlName() || this.name;
    this._options = this.options();

    const asyncOptions = this.asyncOptions();
    if (asyncOptions && !this.lazy()) {
      this.announce('asyncLoading');
      asyncOptions.pipe(takeUntil(this.destroy$)).subscribe((resp) => {
        this._options = resp;
        this.cdr.detectChanges();
      });
    }
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.lazy()) {
      this.initialOptionGetFn()!(this.control.value).pipe(
        first()
      ).subscribe((response) => {
        this._options = [response];
        this.cdr.detectChanges();
      })
    }
  }

  opened(opened: boolean) {
    if (opened) {
      const asyncOptions = this.asyncOptions();
      if (asyncOptions && this.lazy()) {
        this.announce('asyncLoading');
        this.optionsLoading.set(true);
        this.optionSubscription = asyncOptions.pipe(first()).subscribe((resp) => {
          this._options = resp;
          this.optionsLoading.set(false);
          this.cdr.detectChanges();
        });
      }
    } else if(this.optionSubscription && !this.optionSubscription.closed) {
      // Cancelling request if select is closed before response arrived
      this.optionsLoading.set(false);
      this.optionSubscription?.unsubscribe();
      if (this.lazy()) {
        const lastOption = this.lastOptions.find((act) => act.value === this.control.value);
        if (lastOption) {
          this._options = [lastOption];
          this.cdr.detectChanges();
        }
      }
    }
  }

  reset() {
    this.control.reset();
    this.announce('inputReset');
  }
}
