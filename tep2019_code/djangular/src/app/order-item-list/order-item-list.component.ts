import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { OrderItem } from '../models';

@Component({
  selector: 'app-order-item-list',
  templateUrl: './order-item-list.component.html',
  styleUrls: ['./order-item-list.component.css']
})
export class OrderItemListComponent implements OnInit {

  private order_items: Array<OrderItem> = [];
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getOrderItems();
  }
  public getOrderItems() {
    this.apiService.fetchAll("order_items").subscribe((data: Array<OrderItem>) => {
      this.order_items = data;
    });
  }

}
