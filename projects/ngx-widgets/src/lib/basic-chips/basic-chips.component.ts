import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {AsyncPipe, JsonPipe} from '@angular/common';
import {Component, forwardRef, Input, ViewEncapsulation, input} from '@angular/core';
import {NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';

import {Observable} from 'rxjs';
import {BaseInput} from "../core/base-input";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

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
    JsonPipe,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
  ],
})
export class BasicChipsComponent<T> extends BaseInput<T[]> {

  public readonly asyncOptions = input<Observable<T[]>>();
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input() public labelProperty?: keyof T;
  public readonly separatorKeysCodes = [ENTER, COMMA] as const;

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
