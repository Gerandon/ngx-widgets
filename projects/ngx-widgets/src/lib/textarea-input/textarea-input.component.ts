import {Component, forwardRef, ViewEncapsulation, input, AfterViewInit, inject} from '@angular/core';
import { FormsModule, NG_ASYNC_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {BaseTextInput} from "../core/base-text-input";
import {takeUntil} from "rxjs";
import {LiveAnnouncer} from "@angular/cdk/a11y";

interface TextareaAnnouncerTranslations {
  maxLengthReached?: string;
}

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
export class TextareaInputComponent extends BaseTextInput<string> implements AfterViewInit {

  public readonly rows = input(10);
  protected override _defaultAnnouncerTranslations: { [P in keyof TextareaAnnouncerTranslations]-?: TextareaAnnouncerTranslations[P] } = {
    maxLengthReached: 'Elérte a maximális karakter számot!',
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.control.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      if (value.length !== 0 && value.length >= (this.maxLength() ?? 0)) {
        this.announce('maxLengthReached');
      }
    })
  }
}
