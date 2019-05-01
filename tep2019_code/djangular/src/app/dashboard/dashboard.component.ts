import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Order } from '../models';
import { School } from '../models';
import { Teacher } from '../models';
import { AuthenticationService } from '../_services';
import { environment } from '../../environments/environment';
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
  currentUser = null;
  constructor(private apiService: ApiService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.admin_url = environment.admin_url;
    this.getOrders();
    /*
    this.getSchools();
    this.getTeachers();
    */
  }


  public getOrders() {
    this.apiService.fetchAll("orders").subscribe((data: Array<Order>) => {
      this.orders = data;
    });
    // let today_orders = this.orders.filter(oi => oi.checkout_time !== ));
  }
  /*
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
  
    public getNumber() {
      return this.orders.length;
    }
  
    public getNumSchools() {
      return this.schools.length;
    }
  
    public getNumTeachers() {
      return this.teachers.length;
    }
    */


}