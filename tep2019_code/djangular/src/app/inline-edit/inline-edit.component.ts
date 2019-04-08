import { Component, Input, ViewChild, Renderer, forwardRef, PipeTransform } from '@angular/core';
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
  @Input() displayPipe: PipeTransform;
  @Input() onTextClick: any = Function.prototype;
  @Input() fieldType: string = "text"; // right now only supports "text" and "checkbox"
  @Input() required: boolean = true;
  _value: any = null;
  preValue: any = null;
  editing: boolean = false;
  showEditIcon: boolean = false;
  onTouched: any = Function.prototype;

  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
    }
  }

  public displayValue(v) {
    return this.displayPipe ? this.displayPipe.transform(v) : v;
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
    if (this._value === "") {
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
