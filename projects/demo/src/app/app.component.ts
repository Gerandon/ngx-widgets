import {Component, inject} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {catchError, delay, map, Observable, of, switchMap, tap} from "rxjs";
import {BasicChipsComponent, BasicInputComponent, SelectComponent, TextareaInputComponent} from "@gerandon/ngx-widgets";
import {HttpClient} from "@angular/common/http";

const asyncOptions =[
  {label: 'Async Option 1', value: 'option_one'},
  {label: 'Async Option 2', value: 'option_two'},
]

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
    {label: 'Option 1', value: 'option_one'},
    {label: 'Option 2', value: 'option_two'},
  ];

  public readonly initialOptionGetFn = (param: string) => this.getRickAndMorty().pipe(
    map(() => (asyncOptions.find((act) => act.value === param)!))
  )
  public readonly asyncOptions: Observable<any> = this.getRickAndMorty().pipe(
    map(() => asyncOptions),
    tap({
      next: () => console.log('async options arrived'),
      complete: () => console.log('async options request closed')
    }));

  public readonly asyncFilterFn = (searchValue: string) => {
    return this.asyncOptions.pipe(
      map((list) => list.filter((act: any) => act.label.startsWith(searchValue)))
    );
  };

  public readonly formGroup = inject(FormBuilder).group({
    textInput: ['', [
      Validators.required,
      (ctrl: AbstractControl) => (ctrl.value.length < 3 ? {invalidValidationTest: true} : null),
      (ctrl: AbstractControl) => (ctrl.value === 'global' ? {globalValidationMessage: true} : null)
    ]],
    maskedTextInput: '12312312312',
    maskedTextInput2: '12312312312',
    numberInput: '',
    phoneInput: '',
    syncSelect: 'option_one',
    asyncSelect: 'option_two',
    textareaInput: '',
    basicChips: null,
    autocompleteChips: null,
  });

  constructor(private readonly httpClient: HttpClient) {
    this.formGroup.valueChanges.subscribe(console.log);
  }

  getRickAndMorty(...args: any[]) {
    const value = typeof args[0] === 'string' ? args[0] : 'rick';
    return this.httpClient.get<{
      results: any[]
    }>(`https://rickandmortyapi.com/api/character/?name=${value}&status=alive`).pipe(
      map((result: { results: any[] }) => {
        return {
          content: result.results,
        };
      }),
      catchError(() => of({content: []})),
    );
  }
}
