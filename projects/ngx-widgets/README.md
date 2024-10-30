# NgxWidgets

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.x.

## Short Description
This is basically a utility-widget Angular library, for creating `ControlValueAccessors` in an easier way, by implementing and extending
the `Core` classes.

Instead of creating `ControlValueAccessor` implementations in each of our project, this library provides already defined classes for that functionality.

## <a href="https://gerandon.github.io/ngx-widgets/">Try it out - Demo</a>

## Built-In components

Be patient with me, I'm trying to figure out what this README should really contain... :)

## Core Classes

<table>
    <thead>
        <tr>
            <th>File name</th>
            <th>Class name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>base-value-accessor.ts</td>
            <td>BaseValueAccessor</td>
            <td>The main "core" class of the library. It contains the CVA interface implementations and handles the built-in "overridable" and redundant functionalities.</td>
        </tr>
        <tr>
            <td>base.input.ts</td>
            <td>BaseInput</td>
            <td>Simple class that extends the BaseCVA class. It has multiple attributes inside of it, the most common ones such as: "name", "label", "appearance", etc. Extending this class in our component, makes our component to act like a custom control input.</td>
        </tr>
        <tr>
            <td>base-text.input.ts</td>
            <td>BaseTextInput</td>
            <td>This class extends the BaseInput one. It has multiple attributes that are being used in case of "plain" text inputs, such as: "type (text or passwd)", "maxLength", etc.</td>
        </tr>
    </tbody>
</table>

##Widgets (built-in examples)
There are a few custom components, just to present how the core functionality and implementation works and makes
the development easier (especially in case of a newly created project)

In the following example you can see a custom CVA implementation built into the library (as widget)

As you can see, instead of defining what our CVA will look like, we could use the Base implementation from the core of the library. That way (as seen) our component will have significantly less code on its TS side and we also reduced redundancy as well.
###BasicInput (component)
```typescript
@Component({
    selector: 'basic-input',
    templateUrl: './basic-input.component.html',
    styleUrls: ['./basic-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BasicInputComponent), multi: true},
        {provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => BasicInputComponent), multi: true},
    ],
})
export class BasicInputComponent extends BaseTextInput<string> implements OnInit {

    constructor(protected injector: Injector, protected cdr: ChangeDetectorRef) {
        super(cdr, injector);
    }

    ngOnInit() {
        super.ngOnInit();
    }
}
```

```angular2html
<mat-form-field [floatLabel]="floatLabel && 'always'" [appearance]="appearance">
    <mat-label *ngIf="label && floatLabel !== 'never'">{{ label | translate: translateParams }}</mat-label>
    <input
        #inputElement
        #input="ngForm"
        matInput
        label=""
        [type]="type"
        [attr.disabled]="disabled"
        [readonly]="disabled"
        [placeholder]="placeholder | translate: translateParams"
        [formControl]="control"
        [maxLength]="maxLength"
        [name]="name"
        [required]="required"/>
    <mat-icon *ngIf="icon" matPrefix color="primary">{{icon}}</mat-icon>
    <span *ngIf="suffix" matSuffix>{{suffix}}</span>
    <mat-error *ngIf="hasError('required')">{{ 'COMMON.REQUIRED' | translate: translateParams }}</mat-error>
    <mat-error *ngIf="hasError('max')">{{ 'ERROR.NUMERIC.MAX' | translate }}</mat-error>
    <mat-error *ngIf="hasError('min')">{{ 'ERROR.NUMERIC.MIN' | translate }}</mat-error>
</mat-form-field>

```
