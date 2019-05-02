import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../api.service';
import { School, TeacherDetail } from '../models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-teacher-create',
  templateUrl: './teacher-create.component.html',
  styleUrls: ['./teacher-create.component.css']
})
export class TeacherCreateComponent implements OnInit {

  new_teacher = new TeacherDetail(null, '', '', '', '', true, null, [], '');
  schools: Array<School> = [];
  teachers: Array<TeacherDetail> = [];

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<TeacherCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.getActiveSchools();
    this.getTeachers();
  }

  public getTeachers() {
    this.teachers = this.data.teachers;
  }

  public teacherExists() {
    for (let i = 0; i < this.teachers.length; i++) {
      let tch = this.teachers[i];
      if (tch.email === this.new_teacher.email) return true;
    }
    return false;
  }

  public getActiveSchools() {
    this.apiService.fetchAll('schools').subscribe((data: Array<School>) => {
      let all_schools = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].active)
          all_schools.push(data[i]);
      }
      this.schools = all_schools;
    });
  }

}
