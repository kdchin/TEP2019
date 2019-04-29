import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { ApiService } from '../api.service';
import { Teacher, School, TeacherDetail } from '../models';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-teacher-create',
  templateUrl: './teacher-create.component.html',
  styleUrls: ['./teacher-create.component.css']
})
export class TeacherCreateComponent implements OnInit {
  @Output() teacherChange = new EventEmitter<TeacherDetail>();

  new_school = new School(null, '', true);
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
    this.apiService.fetchAll('teachers').subscribe((data: Array<TeacherDetail>) => {
      this.teachers = data;
    });
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

  public onSubmit() {
    this.new_teacher.school = this.new_school;
    this.createTeacher();
  }



  public createTeacher() {
    if (this.teacherExists()) return;
    this.apiService.create("teachers", this.new_teacher).subscribe((response) => {
      this.teacherChange.emit(this.new_teacher);
      this.new_teacher = new TeacherDetail(null, '', '', '', '', true, null, [], '');
      this.dialogRef.close();
      window.location.reload();
    });
  }
}
