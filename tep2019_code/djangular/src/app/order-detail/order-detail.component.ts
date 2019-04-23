import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { OrderDetail, OrderDetailItem } from '../models';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  orderDetail: OrderDetail;

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
    this.apiService.fetchOne("order_detail", id).subscribe((orderDetail: OrderDetail) => this.orderDetail = orderDetail);
  }

  goBack(): void {
    this.location.back();
  }

  makeFalse(): void {
    const id = +this.route.snapshot.paramMap.get('');
    this.apiService.update("order_foo", id)
  }
}