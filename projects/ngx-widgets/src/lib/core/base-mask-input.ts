import {BaseTextInput} from "./base-text-input";
import {AfterViewInit, Directive, ViewChild, input} from "@angular/core";
import {NgxMaskDirective} from "ngx-mask";

@Directive()
export class BaseMaskInput extends BaseTextInput<string> implements AfterViewInit {

  public readonly mask = input<string>();
  public readonly showMaskTyped = input(false);
  public readonly dropSpecialCharacters = input<string[] | boolean | readonly string[] | null>();
  public readonly specialCharacters = input<string[]>();
  public readonly placeHolderCharacter = input<string>('_');

  @ViewChild('maskInput') maskInput!: NgxMaskDirective;

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    this.maskInput._maskService.dropSpecialCharacters = this.dropSpecialCharacters()!;
    this.maskInput['_applyMask']();
  }
}
