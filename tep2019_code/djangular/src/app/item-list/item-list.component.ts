import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Item } from '../models';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  private items: Array<Item> = [];
  private shouldShowCreate = false;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getItems();
  }

  public onNewItem(newItem: Item) {
    this.items.push(newItem);
    this.toggleShowCreate();
  }

  public toggleShowCreate() {
    this.shouldShowCreate = !this.shouldShowCreate;
  }

  public getItems() {
    this.apiService.fetchAll("items").subscribe((data: Array<Item>) => {
      this.items = data;
    });
  }
}
