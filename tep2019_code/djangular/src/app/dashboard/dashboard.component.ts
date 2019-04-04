import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Order } from '../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  selectedOrder: Order;

  private orders: Array<Order> = [];
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getOrders();
  }

  public onSelect(order: Order) {
    this.selectedOrder = order;
  }

  // public deleteOrder(order: Order) {
  //   let new_orders = this.orders.filter(oi => oi.id !== order.id);
  //   // TODO: error and warn
  //   if (new_orders.length != this.orders.length - 1)
  //     return;
  //   this.orders = new_orders;
  //   this.apiService.delete("orders", order.id).subscribe();
  // }

  public getOrders() {
    this.apiService.fetchAll("orders").subscribe((data: Array<Order>) => {
      this.orders = data;
    });
  }

}
