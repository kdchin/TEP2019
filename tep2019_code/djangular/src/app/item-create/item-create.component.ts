import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';
import { Item } from '../models';

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']
})
export class ItemCreateComponent {
  @Output() itemChange = new EventEmitter<Item>();

  constructor(private apiService: ApiService) { }
  new_item = new Item(null, '', '', null, null, true);

  public onSubmit() {
    this.createItem();
    this.itemChange.emit(this.new_item);
    this.new_item = new Item(null, '', '', null, null, true);
  }

  public createItem() {
    // TODO: validation
    if (this.new_item.id === null) return;
    this.apiService.create("items", this.new_item).subscribe((response) => {
      console.log(response);
    });
  }
}