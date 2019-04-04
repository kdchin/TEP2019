import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Order } from '../models';
import { ApiService }  from '../api.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order;

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
    this.apiService.fetchOne("orders", id).subscribe((order: Order) => this.order = order);
  }

  goBack(): void {
    this.location.back();
  }
}