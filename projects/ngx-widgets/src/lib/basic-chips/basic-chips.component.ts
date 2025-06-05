import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {AsyncPipe, JsonPipe} from '@angular/common';
import {Component, forwardRef, Input, ViewEncapsulation, input, viewChild, ElementRef, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';

import {debounceTime, map, Observable, of, Subject, switchMap, tap} from 'rxjs';
import {BaseInput} from "../core/base-input";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {find, isEqual} from "lodash-es";

@Component({
  selector: 'gerandon-basic-chips',
  templateUrl: 'basic-chips.component.html',
  styleUrls: ['basic-chips.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BasicChipsComponent), multi: true}],
  imports: [
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
  ],
})
export class BasicChipsComponent<T> extends BaseInput<T[]> implements OnInit {

  public readonly tsFilterInput = viewChild<ElementRef>('inputElement');
  public readonly asyncFilterFn = input<(value: string) => Observable<T[]>>();
  public readonly asyncOptions = input<Observable<T[]>>();
  public readonly startTypingLabel = input('Kezdjen el gépelni...');
  public readonly emptyListLabel = input('Nincs megjeleníthető elem!');
  /**
   * How much character you need to type before triggering search
   */
  public readonly startAsyncFnAt = input<number>(1);
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input() public labelProperty?: keyof T;
  public readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public filterOptions$?: Observable<T[]>;
  protected _hintLabel!: string;
  private readonly inputChange = new Subject<string>();

  override ngOnInit() {
    super.ngOnInit();
    this._hintLabel = this.hintLabel();
    if (this.asyncFilterFn()) {
      this.filterOptions$ = this.inputChange.pipe(
        debounceTime(300),
        switchMap((value) => {
          if (value && value.length >= this.startAsyncFnAt()) {
            return this.asyncFilterFn()!(value).pipe(
              map((responseList) => {
                return responseList.filter((responseListItem) => {
                  return !find(this.control.value, (controlAct) => isEqual(controlAct, responseListItem));
                })
              })
            );
          }
          return of([]);
        }),
        tap((responseList) => {
          if (!this.tsFilterInput()?.nativeElement.value && !this.control.value) {
            this._hintLabel = 'Kezdjen el gépelni...';
          } else {
            this._hintLabel = !responseList.length ? this.emptyListLabel() : '';
          }
        })
      )
    } else {
      this.filterOptions$ = this.asyncOptions();
    }
  }

  filter() {
    const filterValue = this.tsFilterInput()!.nativeElement.value;
    this.inputChange.next(filterValue);
  }

  remove(item: T) {
    const values: T[] = this.control.value;
    const index = values.indexOf(item);
    if (index >= 0) {
      values.splice(index, 1);
      this.control.setValue(values);
    }

    this.mark();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.updateValue(value as T);
    }
    event.chipInput!.clear();

    this.mark();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.control.value?.includes(event.option.value)) {
      this.updateValue(<T>event.option.value);
    }
    this.inputElement.nativeElement.value = '';

    this.mark();
  }

  private updateValue(value: T) {
    this.control.setValue([
      ...(this.control.value || []),
      value,
    ]);
  }

  private mark() {
    if (!this.control.touched) {
      this.control.markAsTouched();
      this.control.markAsDirty();
    }
  }
}
