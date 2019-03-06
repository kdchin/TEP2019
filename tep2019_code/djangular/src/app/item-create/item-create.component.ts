import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']
})
export class ItemCreateComponent implements OnInit {
  constructor(private apiService: APIService) { }

  ngOnInit() {
  }

  createContact() {

    var item = {
      name: "pens",
      unit_label_name: "packs",
      max_units: 8,
      qty_per_unit: 10,
      active: true,
    };
    this.apiService.createItem(item).subscribe((response) => {
      console.log(response);
    });
  };
}