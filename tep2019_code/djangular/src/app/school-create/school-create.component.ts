import { Component, Output, EventEmitter, Inject, Input, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { School } from '../models';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-school-create',
  templateUrl: './school-create.component.html',
  styleUrls: ['./school-create.component.css']
})
export class SchoolCreateComponent implements OnInit {
  // @Input() all_schools: Array<School> = [];
  @Output() schoolChange = new EventEmitter<School>();

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<SchoolCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  new_school = new School(null, '', true);
  all_schools: Array<School> = [];

  ngOnInit() {
    this.getAllSchools();
  }

  public onSubmit() {
    this.createSchool();
  }

  public getAllSchools() {
    this.apiService.fetchAll('schools').subscribe((data: Array<School>) => {
      this.all_schools = data;
    })
  }


  public reload() {
    window.location.reload();
  }

  public schoolExists() {
    for (let i = 0; i < this.all_schools.length; i++) {
      if (this.all_schools[i].name.toLowerCase() === this.new_school.name.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  public createSchool() {
    if (this.schoolExists()) return;
    this.apiService.create("schools", this.new_school).subscribe((response) => {
      this.schoolChange.emit(this.new_school);
      // TODO: reload page
      this.new_school = new School(null, '', true);
      this.dialogRef.close();
      window.location.reload();
    });
  }
}
