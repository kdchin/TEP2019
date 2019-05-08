import { Component, OnInit } from '@angular/core';
import { OrderDetail, TeacherDetail, School, Waiver, ValPass, Item } from '../models';
import { formatDate } from '@angular/common';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-delete-db',
  templateUrl: './delete-db.component.html',
  styleUrls: ['./delete-db.component.css']
})
export class DeleteDbComponent implements OnInit {

  is_deleting = false;
  understands = false;
  opened_portal = false;
  is_resetting_all = false;
  needed_text = "I solemnly swear that I am up to no good";
  confirm_text = '';
  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  cancelReset() {
    this.understands = false;
    this.opened_portal = false;
    this.is_resetting_all = false;
    this.confirm_text = '';
  }

  startReset(isAll) {
    this.opened_portal = true;
    this.is_resetting_all = isAll;
  }

  deleteWaivers() {
    this.apiService.fetchAll('waivers').subscribe((waivers: Array<Waiver>) => {
      let mostRecent = null;
      for (let i = 0; i < waivers.length; i++) {
        let waiver = waivers[i];
        if (mostRecent === null || waiver.uploaded_date > mostRecent.uploaded_date)
          mostRecent = waiver;
      }
      for (let i = 0; i < waivers.length; i++) {
        let waiver = waivers[i];
        if (waiver.id !== mostRecent.id) {
          this.apiService.delete('waivers', waiver.id).subscribe();
        }
      }
    });
  }

  deletePasswords() {
    this.apiService.fetchAll('validation_passwords').subscribe((val_passes: Array<ValPass>) => {
      let mostRecent = null;
      for (let i = 0; i < val_passes.length; i++) {
        let val_pass = val_passes[i];
        if (mostRecent === null || val_pass.uploaded_date > mostRecent.uploaded_date)
          mostRecent = val_pass;
      }
      for (let i = 0; i < val_passes.length; i++) {
        let val_pass = val_passes[i];
        if (val_pass.id !== mostRecent.id) {
          this.apiService.delete('validation_passwords', val_pass.id).subscribe();
        }
      }
    });
  }

  deleteItems() {
    this.apiService.fetchAll('items').subscribe((items: Array<Item>) => {
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        this.apiService.delete('items', item.id).subscribe();
      }
    });
  }

  exportSchools() {
    this.apiService.fetchAll('schools').subscribe((schools: Array<School>) => {
      var data = [];
      for (let i = 0; i < schools.length; i++) {
        let school = schools[i];
        data.push({
          name: school.name,
        });
      }
      let options = { quoteStrings: '' };
      if (data.length > 0)
        new Angular5Csv(data, `schools`, options);
      for (let i = 0; i < schools.length; i++) {
        this.apiService.delete('schools', schools[i].id).subscribe();
      }
      this.finish();
    });
  }

  exportTeachers() {
    this.apiService.fetchAll('teachers').subscribe((teachers: Array<TeacherDetail>) => {
      var data = [];
      for (let i = 0; i < teachers.length; i++) {
        let teacher = teachers[i];
        data.push({
          first_name: teacher.first_name,
          last_name: teacher.last_name,
          email: teacher.email,
          phone: teacher.phone,
          address: teacher.address,
          school: teacher.school.name,
        });
      }
      let options = { quoteStrings: '' };
      if (data.length > 0)
        new Angular5Csv(data, `teachers`, options);
      for (let i = 0; i < teachers.length; i++) {
        this.apiService.delete('teachers', teachers[i].id).subscribe();
      }
      this.exportSchools();
    });
  }

  exportOrders() {
    this.is_deleting = true;
    this.apiService.fetchAll('order_details').subscribe((orders: Array<OrderDetail>) => {
      var data = [];
      var oldest = null;
      var newest = null;
      for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        if (oldest === null || order.checkout_time < oldest) {
          oldest = order.checkout_time;
        }
        if (newest === null || order.checkout_time > newest) {
          newest = order.checkout_time;
        }
        for (let j = 0; j < order.order_items.length; j++) {
          let oi = order.order_items[j];
          data.push({
            teacher_first_name: order.teacher.first_name,
            teacher_last_name: order.teacher.last_name,
            item_name: oi.item.name,
            item_quantity: oi.item.qty_per_unit * oi.units_taken,
          });
        }
      }
      let fDate = (date: Date) => formatDate(date, 'MM-dd-yyyy', 'en-US');
      let options = { quoteStrings: '' };
      if (data.length > 0)
        new Angular5Csv(data, `${fDate(oldest)} to ${fDate(newest)} Checkouts`, options);
      for (let i = 0; i < orders.length; i++) {
        this.apiService.delete('orders', orders[i].id).subscribe((data) => {
        }); // i think this well cascade delete
      }
      setTimeout(() => {
        this.deletePasswords();
        if (this.is_resetting_all) {
          this.exportTeachers();
          this.deleteItems();
          this.deleteWaivers();
        }
        else this.finish();
      }, 10000); // wait 10 seconds before deleting the rest
    });
  }

  finish() {
    alert("deleted!");
    this.is_deleting = false;
    this.cancelReset();
  }

  reset() {
    if (this.confirm_text !== this.needed_text || !this.understands || !confirm("Please confirm that you'd like to reset!")) return;
    this.exportOrders();
  }

}
