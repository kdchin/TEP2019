import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Item, Teacher, Order, OrderItem, School, Waiver, ValPass } from '../models';
import * as lodash from "lodash";
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.css']
})
export class TeacherFormComponent implements OnInit {

  current_page = 0;
  pages = ["welcome", "waiver", "reminders", "checkout", "success"];
  isNewTeacher = false;
  val_email = "";
  teacher = new Teacher(null, '', '', '', '', true, null);
  all_teachers: Array<Teacher> = [];
  order = new Order(null, new Date().toISOString(), false, false, null);
  school = new School('', false);
  all_schools: Array<School> = [];
  order_items: Array<OrderItem> = [];
  lodash = lodash;
  waiverPath = '';
  val_pass = new ValPass(null, '', new Date());
  guess = '';
  key = 'tep2019cmuis'; // TODO: idk if this is secure
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getActiveItems();
    this.getActiveSchools();
    this.getActiveTeachers();
    this.getRecentWaiver();
    this.getMostRecentPassword();
    this.current_page = 0;
  }
  // TODO: configure back button so it works

  getMostRecentPassword() {
    this.apiService.fetchAll('validation_passwords').subscribe((data: Array<ValPass>) => {
      let mostRecent = null;
      for (let i = 0; i < data.length; i++) {
        if (!mostRecent || (data[i].uploaded_date > mostRecent.uploaded_date))
          mostRecent = data[i];
      }
      if (mostRecent)
        this.val_pass = mostRecent;
    })
  }

  getRecentWaiver() {
    let API_PATH = 'http://localhost:8000';
    this.apiService.fetchAll('waivers').subscribe((data: Array<Waiver>) => {
      let mostRecent = null;
      for (let i = 0; i < data.length; i++) {
        if (!mostRecent || (data[i].uploaded_date > mostRecent.uploaded_date))
          mostRecent = data[i];
      }
      if (mostRecent)
        this.waiverPath = API_PATH + mostRecent.file;// this.getFilePath(mostRecent);
    })
  }

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

  public teacherIsValid() {
    if (!this.teacher.first_name || !this.teacher.last_name
      || !this.teacher.email || !this.teacher.phone || !this.school) {
      console.log("hi");
      return false;
    }
    let found_email = false;
    let matches = false
    for (let i = 0; i < this.all_teachers.length; i++) {
      let other: Teacher = this.all_teachers[i];
      if (other.email == this.teacher.email) {
        found_email = true;
        matches = (other.first_name == this.teacher.first_name
          && other.last_name == this.teacher.last_name
          && other.school.name == this.school.name
          && other.phone == this.teacher.phone);
        break;
      }
    }
    if (this.isNewTeacher) {
      return !found_email;
    }
    return found_email && matches;
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
    this.teacher = new Teacher(null, '', '', '', '', true, null);
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
    if (!this.teacherIsValid() && this.val_email === this.teacher.email) return;
    this.teacher.school = this.school;
    this.advancePage();
  }

  public orderItemsAreValid() {
    for (let i = 0; i < this.order_items.length; i++) {
      let oi: OrderItem = this.order_items[i];
      if (oi.units_taken > oi.item.max_units) return false;
    }
    return true;
  }

  public makeOrderItems(teacher) {
    // this.order.shopping_date = null;
    this.order.teacher = teacher;
    // this.order.shopping_date = this.order.shopping_date.toISOString();
    this.apiService.create('orders', this.order).subscribe((data: Order) => {
      for (let i = 0; i < this.order_items.length; i++) {
        let order_item_with_order: OrderItem = this.order_items[i];
        order_item_with_order.order = data;
        this.apiService.create('order_items', order_item_with_order).subscribe();
      }
    });
  }

  public createOrder() {
    let bytes = crypto.AES.decrypt(this.val_pass.digest, this.key);
    let decoded = bytes.toString(crypto.enc.Utf8);
    if (!this.orderItemsAreValid() || this.guess !== decoded) return;
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
