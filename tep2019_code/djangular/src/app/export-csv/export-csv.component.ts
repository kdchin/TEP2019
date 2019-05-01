import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { OrderDetail, Order } from '../models';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-export-csv',
  templateUrl: './export-csv.component.html',
  styleUrls: ['./export-csv.component.css']
})
export class ExportCsvComponent implements OnInit {

  uploaded_orders: Array<OrderDetail> = [];
  unuploaded_orders: Array<OrderDetail> = [];
  mostRecent: OrderDetail = null;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    // TODO: only do this wehn needed
    this.getAllOrderItems();
  }

  getAllOrderItems() {
    this.apiService.fetchAll('order_details').subscribe(((data: Array<OrderDetail>) => {
      let mostRecent = null;
      for (let i = 0; i < data.length; i++) {
        let order = data[i];
        if (order.uploaded) {
          this.uploaded_orders.push(order);
          if (!mostRecent || mostRecent.checkout_time < order.checkout_time)
            mostRecent = order;
        } else {
          this.unuploaded_orders.push(order);
        }
      }
      this.mostRecent = mostRecent;
    }));
  }

  export(orders: Array<OrderDetail>) {
    if (orders.length === 0) {
      alert("no data to export!");
      return;
    }
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
          teacher: order.teacher.first_name + " " + order.teacher.last_name,
          item_name: oi.item.name,
          item_quantity: oi.item.qty_per_unit * oi.units_taken,
        });
      }
    }
    let fDate = (date: Date) => formatDate(date, 'MM-dd-yyyy', 'en-US');
    let options = { quoteStrings: '' };
    new Angular5Csv(data, `${fDate(oldest)} to ${fDate(newest)} Checkouts`, options);
    for (let i = 0; i < orders.length; i++) {
      let newVal = { ...orders[i] };
      if (!newVal.uploaded) {
        newVal.uploaded = true;
        this.apiService.update('orders', newVal).subscribe();
      }
    }
  }

  resetUploaded() {
    for (let i = 0; i < this.unuploaded_orders.length; i++) {
      let newVal = { ...this.unuploaded_orders[i] };
      if (newVal.uploaded) {
        newVal.uploaded = false;
        this.apiService.update('orders', newVal).subscribe();
      }
    }
  }

  exportLast() {
    this.export(this.unuploaded_orders);
  }

  public alerterLast() {
    let r = confirm("Are you sure you would like to export since last?");
    if (r == true) {
      this.exportLast()
    }
  }

  public alerterAll() {
    let r = confirm("Are you sure you would like to export everything?");
    if (r == true) {
      this.exportAll()
    }
  }

  exportAll() {
    this.export(this.unuploaded_orders.concat(this.uploaded_orders));
  }

}
