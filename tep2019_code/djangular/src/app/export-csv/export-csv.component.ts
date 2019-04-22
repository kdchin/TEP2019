import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { OrderItem } from '../models';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-export-csv',
  templateUrl: './export-csv.component.html',
  styleUrls: ['./export-csv.component.css']
})
export class ExportCsvComponent implements OnInit {

  uploaded_order_items: Array<OrderItem> = [];
  unuploaded_order_items: Array<OrderItem> = [];
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    // TODO: only do this wehn needed
    this.getAllOrderItems();
  }

  getAllOrderItems() {
    this.apiService.fetchAll('order_items').subscribe(((data: Array<OrderItem>) => {
      for (let i = 0; i < data.length; i++) {
        let oi = data[i];
        if (oi.order.uploaded) {
          this.uploaded_order_items.push(oi);
        } else {
          this.unuploaded_order_items.push(oi);
        }
      }
    }));
  }

  export(order_items) {
    if (order_items === []) {
      alert("no data to export!");
      return;
    }
    var data = [];
    var oldest = null;
    var newest = null;
    for (let i = 0; i < order_items.length; i++) {
      let oi = order_items[i];
      data.push({
        teacher: oi.order.teacher.first_name + " " + oi.order.teacher.last_name,
        item_name: oi.item.name,
        item_quantity: oi.item.qty_per_unit * oi.units_taken,
      });
      if (oldest === null || oi.order.shopping_date < oldest) {
        oldest = oi.order.shopping_date;
      }
      if (newest === null || oi.order.shopping_date > newest) {
        newest = oi.order.shopping_date;
      }
    }
    let fDate = (date: Date) => formatDate(date, 'MM-dd-yyyy', 'en-US');
    new Angular5Csv(data, `${fDate(oldest)} to ${fDate(newest)} Checkouts`);
    for (let i = 0; i < order_items.length; i++) {
      let newVal = { ...order_items[i].order };
      newVal.uploaded = true;
      this.apiService.update('orders', newVal).subscribe();
    }
  }

  exportLast() {
    this.export(this.unuploaded_order_items);
  }

  exportAll() {
    this.export(this.unuploaded_order_items.concat(this.uploaded_order_items));
  }

}
