import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  private items: Array<object> = [];
  shouldShowCreate = false;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getItems();
  }

  public toggleShowCreate() {
    this.shouldShowCreate = !this.shouldShowCreate;
  }

  public getItems() {
    this.apiService.fetchAll("items").subscribe((data: Array<object>) => {
      this.items = data;
    });
  }
}
