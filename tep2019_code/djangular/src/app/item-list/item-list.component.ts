import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  private items: Array<object> = [];
  constructor(private apiService: APIService) { }
  ngOnInit() {
    this.getItems();
  }
  public getItems() {
    this.apiService.fetchAll("items").subscribe((data: Array<object>) => {
      this.items = data;
    });
  }
}
