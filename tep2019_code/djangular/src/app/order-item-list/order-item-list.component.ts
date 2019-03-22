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

  public deleteOrderItem(order_item: OrderItem) {
    let new_order_items: Array<OrderItem> = this.order_items.filter(oi => oi.id !== order_item.id);
    // TODO: error and warn
    if (new_order_items.length != this.order_items.length - 1)
      return;
    this.order_items = new_order_items;
    this.apiService.delete("order_items", order_item.id).subscribe();
  }

  public updateOrderItem(i: number, attr: string) {
    return (new_value) => {
      let order_item = this.order_items[i];
      if (parseInt(new_value) == NaN || parseInt(new_value) === order_item[attr]) return;
      order_item[attr] = parseInt(new_value);
      this.apiService.update("order_items", order_item).subscribe();
    }
  }

  public getOrderItems() {
    this.apiService.fetchAll("order_items").subscribe((data: Array<OrderItem>) => {
      this.order_items = data;
    });
  }

}
