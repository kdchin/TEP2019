import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Item, Teacher, Order, OrderItem, School } from '../models';
import * as lodash from "lodash";

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.css']
})
export class TeacherFormComponent implements OnInit {

  current_page = 0;
  pages = ["welcome", "waiver", "reminders", "checkout", "success"];
  isNewTeacher = false;
  teacher = new Teacher(null, '', '', '', '', true);
  all_teachers: Array<Teacher> = [];
  order = new Order(null, new Date().toISOString(), false, false, null);
  school = new School('', false);
  all_schools: Array<School> = [];
  order_items: Array<OrderItem> = [];
  lodash = lodash;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getActiveItems();
    this.getActiveSchools();
    this.getActiveTeachers();
    this.current_page = 0;
  }
  // TODO: configure back button so it works

  public getActiveItems() {
    this.apiService.fetchAll('items').subscribe((data: Array<Item>) => {
      // TODO: add item order customization
      // TODO: loop over and not have it be an object
      for (let i = 0; i < data.length; i++) {
        if (data[i].active)
          this.order_items.push(new OrderItem(null, data[i], this.order, 0));
      }
    });
  }

  public getActiveSchools() {
    this.apiService.fetchAll('schools').subscribe((data: Array<School>) => {
      // TODO: add item order customization
      // TODO: loop over and not have it be an object
      for (let i = 0; i < data.length; i++) {
        if (data[i].active)
          this.all_schools.push(data[i]);
      }
    });
  }

  public getActiveTeachers() {
    this.apiService.fetchAll('teachers').subscribe((data: Array<Teacher>) => {
      // TODO: add item order customization
      // TODO: loop over and not have it be an object
      for (let i = 0; i < data.length; i++) {
        if (data[i].active)
          this.all_teachers.push(data[i]);
      }
    });
  }

  public advancePage() {
    this.current_page++;
    if (this.current_page >= this.pages.length)
      this.current_page = 0;
  }

  public backPage() {
    this.current_page--;
    if (this.current_page < 0)
      this.current_page++;
  }

  public finish() {
    this.isNewTeacher = false;
    this.teacher = new Teacher(null, '', '', '', '', true);
    this.order = new Order(null, new Date().toISOString(), false, false, null);
    this.school = new School('', false);
    this.order_items = [];
    this.advancePage();
  }

  public getTeacherId() {
    for (let i = 0; i < this.all_teachers.length; i++) {
      let cur_teacher = this.all_teachers[i];
      /* TODO: add this back in
      if (cur_teacher.first_name === this.teacher.first_name &&
        cur_teacher.last_name === this.teacher.last_name &&
        cur_teacher.email === this.teacher.email &&
        cur_teacher.phone === this.teacher.email)
        */
      if (cur_teacher.email === this.teacher.email)
        return cur_teacher;
    }
    this.isNewTeacher = true;
    return 0;
  }

  // will create teacher once "submit" is pressed on the checkout page
  public processTeacher() {
    if (!this.teacher.first_name) return;
    if (this.isNewTeacher) {
      // TODO: validate is in the database
    } else {
      // TODO: validate is a valid teacher
    }
    // TODO: apply this // this.teacher.school = this.school;
    this.advancePage();
  }

  public makeOrderItems(teacher_id) {
    console.log("teacher id: ", teacher_id);
    // this.order.shopping_date = null;
    this.order.teacher = teacher_id;
    console.log(this.order);
    // this.order.shopping_date = this.order.shopping_date.toISOString();
    this.apiService.create('orders', this.order).subscribe((data: Order) => {
      console.log("data", data);
      for (let i = 0; i < this.order_items.length; i++) {
        let order_item_with_order: OrderItem = this.order_items[i];
        order_item_with_order.order = data;
        console.log(order_item_with_order);
        this.apiService.create('order_items', order_item_with_order).subscribe();
      }
    });
  }

  public createOrder() {
    // TODO this is a workaround for units_taken being two-way binded to strings
    for (let i = 0; i < this.order_items.length; i++) {
      if (typeof this.order_items[i].units_taken === 'string') {
        // this.order_items[i].units_taken = parseInt(this.order_items[i].units_taken);
      }
    }
    // TODO: if new school this.apiService.create('school', this.school);
    let tid = this.getTeacherId();
    if (this.isNewTeacher) {
      this.apiService.create('teachers', this.teacher).subscribe(
        (teacher: Teacher) => { this.makeOrderItems(teacher); });
    } else {
      this.makeOrderItems(tid);
    }
    this.advancePage();
  }

  public agreeToWaiver() {
    this.order.waiver_signed = true;
    this.advancePage();
  }

  public maxOutOrderItem(order_item: OrderItem) {
    order_item.units_taken = order_item.item.max_units;
  }

}
