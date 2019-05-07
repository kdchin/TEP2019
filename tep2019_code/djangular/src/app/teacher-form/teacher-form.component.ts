import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Item, Teacher, Order, OrderItem, School, Waiver, ValPass } from '../models';
import * as lodash from "lodash";
import * as crypto from 'crypto-js';
import { environment } from '../../environments/environment';

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
  teacher = new Teacher(null, '', '', '', '', true, null, '');
  new_address: string = "";
  all_teachers: Array<Teacher> = [];
  order = new Order(null, '', false, null, null, '');
  school = null;//new School(null, '', false);
  all_schools: Array<School> = [];
  order_items: Array<OrderItem> = [];
  lodash = lodash;
  recentWaiver: Waiver = null;
  agreedToWaiver = false;
  val_pass = new ValPass(null, '', null, '');
  guess = '';
  key = environment.val_pass_key;
  went_back = false;
  submit_pressed = false;
  is_loading_teachers = true;
  is_loading_schools = true;
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

  formatFileName(file) {
    return file.replace(/^.*[\\\/]/, '');
  }

  getRecentWaiver() {
    this.apiService.fetchAll('waivers').subscribe((data: Array<Waiver>) => {
      let mostRecent = null;
      for (let i = 0; i < data.length; i++) {
        if (!mostRecent || (data[i].uploaded_date > mostRecent.uploaded_date))
          mostRecent = data[i];
      }
      if (mostRecent) {
        this.recentWaiver = mostRecent;
      }
      // this.waiverPath = `https://s3.us-east-2.amazonaws.com/tallyhq-waivers/${this.formatFileName(mostRecent.file)}`;
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
      this.order_items = this.lodash.sortBy(this.order_items, (oi: OrderItem) => oi.item.rank, ['asc']);
    });
  }

  public getActiveSchools() {
    this.apiService.fetchAll('schools').subscribe((data: Array<School>) => {
      // TODO: add item order customization
      // TODO: loop over and not have it be an object
      let all_schools = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].active)
          all_schools.push(data[i]);
      }
      this.all_schools = all_schools;
      this.is_loading_schools = false;
    });
  }

  public getActiveTeachers() {
    this.apiService.fetchAll('teacher_singles').subscribe((data: Array<Teacher>) => {
      // TODO: add item order customization
      // TODO: loop over and not have it be an object
      for (let i = 0; i < data.length; i++) {
        if (data[i].active)
          this.all_teachers.push(data[i]);
      }
      this.is_loading_teachers = false;
    });
  }

  public teacherIsValid() {
    if (!this.teacher.first_name || !this.teacher.last_name
      || !this.teacher.email || !this.school) {
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
          && (this.school !== null && other.school.name == this.school.name));
        break;
      }
    }
    return !this.isNewTeacher && found_email && matches;
  }

  public advancePage() {
    this.current_page++;
    if (this.current_page >= this.pages.length)
      this.current_page = 0;
  }

  public backPage() {
    this.went_back = true;
    this.current_page--;
    if (this.current_page < 0)
      this.current_page++;
  }

  public finish() {
    this.isNewTeacher = false;
    this.teacher = new Teacher(null, '', '', '', '', true, null, '');
    this.order = new Order(null, null, false, null, null, '');
    this.school = null;//  new School(null, '', false);
    this.val_email = "";
    this.guess = "";
    this.agreedToWaiver = false;
    this.advancePage();
  }

  public getTeacher() {
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
    return 0;
  }

  // will create teacher once "submit" is pressed on the checkout page
  public processTeacher() {
    if (!this.teacherIsValid() || this.val_email !== this.teacher.email) return;
    this.teacher.school = this.school;
    this.teacher.address = this.new_address;
    this.advancePage();
  }

  public orderItemsNonZero() {
    let found = false;
    for (let i = 0; i < this.order_items.length; i++) {
      let oi: OrderItem = this.order_items[i];
      found = found || oi.units_taken > 0;
    }
    return found;
  }

  public orderItemsAreValid() {
    for (let i = 0; i < this.order_items.length; i++) {
      let oi: OrderItem = this.order_items[i];
      if (oi.units_taken > oi.item.max_units) return false;
    }
    return true;
  }

  getHash(pwd: string) {
    return crypto.SHA256(pwd).toString();
  }

  public createOrderItems() {
    this.order.checkout_time = new Date().toISOString();
    this.order.password_hash = this.getHash(this.guess);
    this.apiService.create('orders', this.order, this.order.password_hash).subscribe((data: Order) => {
      for (let i = 0; i < this.order_items.length; i++) {
        let order_item_with_order: OrderItem = this.order_items[i];
        if (order_item_with_order.units_taken > 0) {
          order_item_with_order.order = data;
          this.apiService.create('order_items', order_item_with_order, this.order.password_hash).subscribe();
        }
      }
      this.advancePage();
    },
      (error) => alert("Error creating order. Please see a TEP employee"));
  }

  public makeOrderItems(teacher) {
    // only update address and phone if provided
    teacher.address = this.new_address ? this.new_address : teacher.address;
    teacher.phone = this.teacher.phone ? this.teacher.phone : teacher.phone;
    this.order.teacher = teacher;
    if (this.new_address.length > 0 || this.teacher.phone.length > 0) {
      this.apiService.update('teacher_update', teacher, this.getHash(this.guess)).subscribe(() => {
        this.createOrderItems();
      });
    } else {
      this.createOrderItems();
    }
  }

  public password_on_focus() {
    this.submit_pressed = false;
  }

  public password_matches(guess) {
    let bytes = crypto.AES.decrypt(this.val_pass.digest, this.key);
    let decoded = bytes.toString(crypto.enc.Utf8);
    return guess === decoded;
  }

  public createOrder() {
    this.submit_pressed = true;
    if (!this.orderItemsAreValid() || !this.guess || this.guess.length < 5 || !this.password_matches(this.guess)) {
      return;
    }
    let tchr = this.getTeacher();
    // this.order.waiver = this.recentWaiver;
    if (this.isNewTeacher)
      return;
    this.makeOrderItems(tchr);
  }

  public maxOutOrderItem(order_item: OrderItem) {
    order_item.units_taken = order_item.item.max_units;
  }

}