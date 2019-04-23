import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Item } from '../models';

import { BoolPipe } from '../bool.pipe';
import * as lodash from "lodash";


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  selectedItem: Item;
  activeItems: Array<Item> = [];
  inactiveItems: Array<Item> = [];
  shouldShowCreate = false;
  activePipe = new BoolPipe();
  lodash = lodash;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getItems();
    this.lodash = lodash;
  }

  public onNewItem(newItem: Item) {
    newItem.rank = newItem.id ? newItem.id : this.activeItems.length;
    this.activeItems.push(newItem);
    this.activeItems = this.lodash.sortBy(this.activeItems, 'rank');
    this.toggleShowCreate();
  }


  public onSelect(item: Item) {
    this.selectedItem = item;
  }


  public toggleShowCreate() {
    this.shouldShowCreate = !this.shouldShowCreate;
  }

  public updateActive(i: number) {
    return (isNowActive) => {
      // TODO check validity of item
      if (isNowActive) {
        let item = this.inactiveItems[i];
        item.active = isNowActive;
        this.inactiveItems = lodash.filter(this.inactiveItems, (it: Item) => it.id !== item.id);
        this.activeItems.push(item);
        this.apiService.update("items", item).subscribe();
        this.activeItems = this.lodash.sortBy(this.activeItems, 'rank');
      } else {
        let item = this.activeItems[i];
        item.active = isNowActive;
        this.activeItems = lodash.filter(this.activeItems, (it: Item) => it.id !== item.id);
        this.inactiveItems.push(item);
        this.apiService.update("items", item).subscribe();
      }
    }
  }

  public isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  public updateRank(i: number) {
    return (newRank) => {
      if (this.isNumeric(newRank)) {
        let item = this.activeItems[i];
        item.rank = parseInt(newRank);
        this.apiService.update("items", item).subscribe();
        this.activeItems = this.lodash.sortBy(this.activeItems, 'rank');
      }
    }
  }

  public getItems() {
    this.apiService.fetchAll("items").subscribe((data: Array<Item>) => {
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        // rank defaults to 0, so we should assign a temp rank (id)
        if (item.rank === 0) {
          item.rank = item.id;
          this.apiService.update('items', item).subscribe((new_item: Item) => {
            if (item.active) {
              this.activeItems.push(item);
            } else {
              this.inactiveItems.push(item);
            }
          });
        } else {
          if (item.active) {
            this.activeItems.push(item);
          } else {
            this.inactiveItems.push(item);
          }
        }
      }
      this.activeItems = this.lodash.sortBy(this.activeItems, 'rank');
    });
  }

}
