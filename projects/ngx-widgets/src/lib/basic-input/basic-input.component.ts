import {
  Component,
  EventEmitter,
  forwardRef,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { NG_ASYNC_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { BaseTextInput } from '../core/base-text-input';

@Component({
  selector: 'gerandon-basic-input',
  templateUrl: './basic-input.component.html',
  styleUrls: ['./basic-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BasicInputComponent), multi: true },
    { provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => BasicInputComponent), multi: true },
  ],
})
export class BasicInputComponent extends BaseTextInput<string> implements OnInit {

  @Output() iconClick = new EventEmitter();

  override ngOnInit() {
    super.ngOnInit();
    this.id = this.id || this.name;
  }
}
