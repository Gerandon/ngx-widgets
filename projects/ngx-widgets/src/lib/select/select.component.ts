import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import {BaseInput} from '../core/base-input';
import { isEqual } from 'lodash-es';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface SelectOptionType {
  label: string;
  value: string | number | null | unknown;
}

@Component({
  selector: 'gerandon-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true }
  ],
  imports: [
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
})
export class SelectComponent extends BaseInput<unknown> implements OnInit {

  /**
   * In this case, an empty option appears that resets the control, to an empty value state
   */
  @Input() public emptyOptionLabel?: string;
  @Input() public multiple?: boolean;
  @Input() public options!: SelectOptionType[];
  @Input() public asyncOptions!: Observable<SelectOptionType[]>;
  @ViewChildren('optionElements') public optionElements!: QueryList<ElementRef>;

  /**
   * Angular Material - Select component comparsion is only '===', does not work with Array values
   * https://github.com/angular/components/blob/a07c0758a5ec2eb4de1bb822354be08178c66aa4/src/lib/select/select.ts#L242C48-L242C58
   */
  public readonly _isEqual = isEqual;

  override ngOnInit() {
    this.placeholder = !this.placeholder ? (this.validationTranslations?.selectGlobalPlaceholder || this.label) : this.placeholder;
    super.ngOnInit();
    this.id = this.id || this.formControlName || this.name;
    if (this.asyncOptions) {
      this.asyncOptions.pipe(takeUntil(this.destroy$)).subscribe((resp) => {
        this.options = resp;
        this.cdr.detectChanges();
      });
    }
  }
}
