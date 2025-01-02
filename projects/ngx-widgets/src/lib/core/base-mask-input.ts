import {BaseTextInput} from "./base-text-input";
import {AfterViewInit, Directive, Input, OnInit, ViewChild} from "@angular/core";
import {NgxMaskDirective} from "ngx-mask";

@Directive()
export class BaseMaskInput extends BaseTextInput<string> implements OnInit, AfterViewInit {

  @Input() public mask?: string;
  @Input() public showMaskTyped = false;
  @Input() public dropSpecialCharacters?: string[] | boolean | readonly string[] | null;
  @Input() public specialCharacters?: string[] | undefined;
  @Input() public placeHolderCharacter: string = '_';
  @Input() public maskPrefix: string = '';
  @Input() public maskSuffix: string = '';

  @ViewChild('maskInput') maskInput!: NgxMaskDirective;

  override ngOnInit() {
    super.ngOnInit();
    this.type = 'text';
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    if (this.maskInput) {
      this.maskInput._maskService.dropSpecialCharacters = this.dropSpecialCharacters!;
      this.maskInput['_applyMask']();
    }
  }
}
