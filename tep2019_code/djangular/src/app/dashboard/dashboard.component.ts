import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Order } from '../models';
import { School } from '../models';
import { Teacher } from '../models';
// import {ValidationPassword} from '../models';


import { getLocaleDateTimeFormat, DatePipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  selectedOrder: Order;

  // private passwords: Array<ValidationPassword> = []; 

  teachers: Array<Teacher> = [];
  orders: Array<Order> = [];
  schools: Array<School> = [];
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getOrders();
    this.getSchools();
    this.getTeachers();
    // this.getPasswords();
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
    // let today_orders = this.orders.filter(oi => oi.checkout_time !== ));
  }

  public getSchools() {
    this.apiService.fetchAll("schools").subscribe((data: Array<School>) => {
      this.schools = data;
    });
  }

  public getTeachers() {
    this.apiService.fetchAll("teachers").subscribe((data: Array<Teacher>) => {
      this.teachers = data;
    });
  }

  // public getPasswords() {
  //   this.apiService.fetchAll("validationpasswords").subscribe((data: Array<ValidationPassword>) => {
  //     this.passwords = data;
  //   });
  // }

  // public getPassword(){
  //   return this.passwords[0].uploaded_date;
  // }



  public getNumber() {
    return this.orders.length;
  }

  public getNumSchools() {
    return this.schools.length;
  }

  public getNumTeachers() {
    return this.teachers.length;
  }


}