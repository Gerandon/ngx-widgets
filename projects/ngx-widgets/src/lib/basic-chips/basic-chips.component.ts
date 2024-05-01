import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Observable } from 'rxjs';
import {BaseInput} from "../core/base-input";

@Component({
  selector: 'gerandon-basic-chips',
  templateUrl: 'basic-chips.component.html',
  styleUrls: ['basic-chips.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BasicChipsComponent), multi: true }],
  imports: [
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    JsonPipe,
  ],
})
export class BasicChipsComponent<T> extends BaseInput<T[]> {

  @Input() public asyncOptions?: Observable<T[]>;
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
