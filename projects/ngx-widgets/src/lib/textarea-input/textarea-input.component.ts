import { Component, forwardRef, ViewEncapsulation, input } from '@angular/core';
import { FormsModule, NG_ASYNC_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {BaseTextInput} from "../core/base-text-input";

@Component({
  selector: 'gerandon-textarea-input',
  templateUrl: 'textarea-input.component.html',
  styleUrls: ['textarea-input.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextareaInputComponent), multi: true },
    { provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => TextareaInputComponent), multi: true },
  ],
})
export class TextareaInputComponent extends BaseTextInput<string> {

  public readonly rows = input(10);

}
