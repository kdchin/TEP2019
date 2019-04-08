import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Order } from '../models';

import { Teacher } from '../models';
import { ApiService }  from '../api.service';
import { PhonePipe } from '../phone.pipe';
import { BoolPipe } from '../bool.pipe';

@Component({
  selector: 'app-teacher-detail',
  templateUrl: './teacher-detail.component.html',
  styleUrls: ['./teacher-detail.component.css']
})
export class TeacherDetailComponent implements OnInit {
  teacher: Teacher;

  selectedOrder: Order;

  private order: Array<Order> = [];
  // private newOrders: Array<Order> = [];
  private orders2: Array<Order> = [];
  private phonePipe = new PhonePipe();
  private activePipe = new BoolPipe();
 
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location
    
  ) { }
 
  ngOnInit() {
    this.getTeacher();
    this.getOrders();
  }

  getTeacher(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.apiService.fetchOne("teachers", id).subscribe((teacher: Teacher) => this.teacher = teacher);

    this.orders2 = this.objects.orders;
  }

  goBack(): void {
    this.location.back();
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
    const id = +this.route.snapshot.paramMap.get('id');

    this.apiService.fetchAll("orders").subscribe((data: Array<Order>) => {
      this.order = data;
    })
    
    


    // for (let order of this.orders) {
    //   if (order.teacher.email ==  this) {
    //     this.newOrders.push(order);
    //   }
    // }
    
    // this.orders = this.newOrders;
  }
}
