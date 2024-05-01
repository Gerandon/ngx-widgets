import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BasicInputComponent} from "../../../ngx-widgets/src/lib/basic-input/basic-input.component";
import {SelectComponent} from "../../../ngx-widgets/src/lib/select/select.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable, of} from "rxjs";
import {TextareaInputComponent} from "../../../ngx-widgets/src/lib/textarea-input/textarea-input.component";
import {BasicChipsComponent} from "../../../ngx-widgets/src/lib/basic-chips/basic-chips.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BasicInputComponent,
    SelectComponent,
    ReactiveFormsModule,
    TextareaInputComponent,
    BasicChipsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  public readonly syncOptions = [
    { label: 'Option 1', value: 'option_one' },
    { label: 'Option 2', value: 'option_two' },
  ];

  public readonly asyncOptions: Observable<any> = of([
    { label: 'Async Option 1', value: 'option_one' },
    { label: 'Async Option 2', value: 'option_two' },
  ]);

  public readonly formGroup = inject(FormBuilder).group({
    textInput: ['', Validators.required],
    numberInput: '',
    phoneInput: '',
    syncSelect: 'option_one',
    asyncSelect: 'option_two',
    textareaInput: '',
    basicChips: null,
    autocompleteChips: null,
  });
}
