import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Order } from '../models';
import { School } from '../models';
import { Teacher } from '../models';
import { AuthenticationService } from '../_services';
import { environment } from '../../environments/environment';
import * as lodash from "lodash";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  selectedOrder: Order;

  orders: Array<Order> = [];
  num_teachers: number = 0;
  num_schools: number = 0;
  currentUser = null;
  admin_url = '';
  constructor(private apiService: ApiService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.admin_url = environment.admin_url;
    this.getOrders();
    this.getSchools();
    this.getTeachers();
  }

  mostRecent(data: Array<Order>) {
    let k = 10;
    return lodash.sortBy(data, data => data.checkout_time).reverse().slice(0, k);
  }

  public getOrders() {
    this.apiService.fetchAll("orders").subscribe((data: Array<Order>) => {
      this.orders = this.mostRecent(data);
    });
  }
  public getSchools() {
    this.apiService.fetchAll("schools").subscribe((data: Array<School>) => {
      this.num_schools = data.length;
    });
  }

  public getTeachers() {
    this.apiService.fetchAll("teachers").subscribe((data: Array<Teacher>) => {
      this.num_teachers = data.length;
    });
  }

  public getNumber() {
    return this.orders.length;
  }

  public getNumSchools() {
    return this.num_schools;
  }

  public getNumTeachers() {
    return this.num_teachers;
  }

}