import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Item } from '../models';
<<<<<<< HEAD
import { BoolPipe } from '../bool.pipe';
=======
>>>>>>> 260ebcd1531a3af5f2e1e9e57796987434f729cb

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  selectedItem: Item;

  private items: Array<Item> = [];
  private shouldShowCreate = false;
<<<<<<< HEAD
  private activePipe = new BoolPipe();
=======
>>>>>>> 260ebcd1531a3af5f2e1e9e57796987434f729cb
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getItems();
  }

  public onNewItem(newItem: Item) {
    this.items.push(newItem);
    this.toggleShowCreate();
  }

<<<<<<< HEAD
  public onSelect(item: Item) {
    this.selectedItem = item;
  }

=======
>>>>>>> 260ebcd1531a3af5f2e1e9e57796987434f729cb
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
