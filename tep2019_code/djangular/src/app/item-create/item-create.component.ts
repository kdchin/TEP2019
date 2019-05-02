import { Component, Inject } from '@angular/core';
import { Item } from '../models';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']
})
export class ItemCreateComponent {

  constructor(public dialogRef: MatDialogRef<ItemCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  new_item = new Item(null, '', '', null, null, true, 0);

}