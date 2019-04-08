import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Order } from '../models';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  selectedOrder: Order;

  private orders: Array<Order> = [];
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getOrders();
  }

  public onSelect(order: Order) {
    this.selectedOrder = order;
  }

  public deleteOrder(order: Order) {
    let new_orders = this.orders.filter(oi => oi.id !== order.id);
    // TODO: error and warn
    if (new_orders.length != this.orders.length - 1)
      return;
    this.orders = new_orders;
    this.apiService.delete("orders", order.id).subscribe();
  }

  public getOrders() {
    this.apiService.fetchAll("orders").subscribe((data: Array<Order>) => {
      this.orders = data;
    });
  }

  public alerter(order: Order){
    let r = confirm("Are you sure you would like to delete this order?");
    if (r == true) {
      this.deleteOrder(order)
    } 
  }

}
