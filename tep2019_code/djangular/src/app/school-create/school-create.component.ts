import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { School } from '../models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-school-create',
  templateUrl: './school-create.component.html',
  styleUrls: ['./school-create.component.css']
})
export class SchoolCreateComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<SchoolCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  new_school = new School(null, '', true);
  all_schools: Array<School> = [];

  ngOnInit() {
    this.getAllSchools();
  }

  public getAllSchools() {
    this.all_schools = this.data.schools;
  }

  public schoolExists() {
    for (let i = 0; i < this.all_schools.length; i++) {
      if (this.all_schools[i].name.toLowerCase() === this.new_school.name.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

}
