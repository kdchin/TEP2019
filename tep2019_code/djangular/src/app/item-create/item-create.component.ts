import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Item } from '../item';

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']
})
export class ItemCreateComponent {
  constructor(private apiService: ApiService) { }
  new_item = new Item('', '', null, null, true);

  public onSubmit() {
    this.createItem();
    // TODO: reload page
    this.new_item = new Item('', '', null, null, true);
  }

  public createItem() {
    this.apiService.create("items", this.new_item).subscribe((response) => {
      console.log(response);
    });
  }
}