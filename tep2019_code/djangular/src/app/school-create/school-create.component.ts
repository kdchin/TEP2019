import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { ApiService } from '../api.service';
import { School } from '../models';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-school-create',
  templateUrl: './school-create.component.html',
  styleUrls: ['./school-create.component.css']
})
export class SchoolCreateComponent {
  @Output() schoolChange = new EventEmitter<School>();

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<SchoolCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  new_school = new School(null, '', true);

  public onSubmit() {
    this.createSchool();
  }

  public reload() {
    window.location.reload();
  }

  public createSchool() {
    this.apiService.create("schools", this.new_school).subscribe((response) => {
      console.log(response);
      this.schoolChange.emit(this.new_school);
      // TODO: reload page
      this.new_school = new School(null, '', true);
      this.dialogRef.close();
      window.location.reload();
    });
  }
}
