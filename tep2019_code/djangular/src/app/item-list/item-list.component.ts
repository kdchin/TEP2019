import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Item } from '../models';
import { BoolPipe } from '../bool.pipe';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  selectedItem: Item;

  items: Array<Item> = [];
  shouldShowCreate = false;
  activePipe = new BoolPipe();
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getItems();
  }

  public onNewItem(newItem: Item) {
    this.items.push(newItem);
    this.toggleShowCreate();
  }

  public onSelect(item: Item) {
    this.selectedItem = item;
  }

  public toggleShowCreate() {
    this.shouldShowCreate = !this.shouldShowCreate;
  }

  public updateItem(i: number, attr: string) {
    return (new_value) => {
      // TODO check validity of item
      let item = this.items[i];
      item[attr] = new_value;
      this.apiService.update("items", item).subscribe();
    }
  }

  public getItems() {
    this.apiService.fetchAll("items").subscribe((data: Array<Item>) => {
      this.items = data;
    });
  }
}
