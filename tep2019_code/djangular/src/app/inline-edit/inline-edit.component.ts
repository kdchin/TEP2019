import { Component, Input, ViewChild, Renderer, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InlineEditComponent),
  multi: true
};

@Component({
  selector: 'app-inline-edit',
  templateUrl: './inline-edit.component.html',
  providers: [VALUE_ACCESSOR],
  styleUrls: ['./inline-edit.component.css']
})

export class InlineEditComponent implements ControlValueAccessor {
  @Input() label: string = "Enter value here";
  @Input() onChange: any = Function.prototype;
  @Input() required: boolean = true;
  private _value: string = '';
  private preValue: string = '';
  private editing: boolean = false;
  private showEditIcon: boolean = false;
  public onTouched: any = Function.prototype;

  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
    }
  }

  writeValue(value: any) {
    this._value = value;
  }

  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  onBlur($event: Event) {
    this.editing = false;
    if (this._value == "") {
      this._value = this.preValue;
    } else {
      this.onChange(this.value);
    }
  }

  beginEdit(value) {
    this.preValue = value;
    this.editing = true;
  }

  mouseEnter() {
    this.showEditIcon = true;
  }

  mouseLeave() {
    this.showEditIcon = false;
  }
}
