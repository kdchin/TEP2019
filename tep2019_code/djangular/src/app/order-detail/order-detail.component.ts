import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

<<<<<<< HEAD
import { Order } from '../models';
=======
import { OrderDetail, OrderDetailItem  } from '../models';
>>>>>>> 3db638e7fda5bb5f903235eb6183e9e16ac7e1fa
import { ApiService }  from '../api.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
<<<<<<< HEAD
  order: Order;
=======
  orderDetail: OrderDetail;
>>>>>>> 3db638e7fda5bb5f903235eb6183e9e16ac7e1fa

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getOrder();
  }

  getOrder(): void {
    const id = +this.route.snapshot.paramMap.get('id');
<<<<<<< HEAD
    this.apiService.fetchOne("orders", id).subscribe((order: Order) => this.order = order);
=======
    this.apiService.fetchOne("order_foo", id).subscribe((orderDetail: OrderDetail) => this.orderDetail = orderDetail);
>>>>>>> 3db638e7fda5bb5f903235eb6183e9e16ac7e1fa
  }

  goBack(): void {
    this.location.back();
  }
}