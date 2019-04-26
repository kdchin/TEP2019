import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { ApiService } from '../api.service';
import { Item } from '../models';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']
})
export class ItemCreateComponent {
  @Output() itemChange = new EventEmitter<Item>();

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<ItemCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  
  new_item = new Item(null, '', '', null, null, true, 0);

  public onSubmit() {
    this.createItem();
    this.dialogRef.close();
    window.location.reload();
  }

  public createItem() {
    // TODO: validation
    this.apiService.create("items", this.new_item).subscribe((response: Item) => {
      this.itemChange.emit(response);
      this.new_item = new Item(null, '', '', null, null, true, 0);
    });
  }
}