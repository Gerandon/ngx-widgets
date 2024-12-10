import {Component, inject} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable, of} from "rxjs";
import {BasicChipsComponent, SelectComponent, TextareaInputComponent} from "@gerandon/ngx-widgets";
import {BasicInputComponent} from "../../../ngx-widgets/src/lib/basic-input/basic-input.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
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
    textInput: ['', [Validators.required, (ctrl: AbstractControl) => ({ invalidValidationTest: true })]],
    maskedTextInput: '',
    numberInput: '',
    phoneInput: '',
    syncSelect: 'option_one',
    asyncSelect: 'option_two',
    textareaInput: '',
    basicChips: null,
    autocompleteChips: null,
  });

  constructor() {
    this.formGroup.valueChanges.subscribe(console.log);
  }
}
