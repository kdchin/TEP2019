import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Teacher, School, TeacherDetail } from '../models';

@Component({
  selector: 'app-teacher-create',
  templateUrl: './teacher-create.component.html',
  styleUrls: ['./teacher-create.component.css']
})
export class TeacherCreateComponent implements OnInit {
  @Output() teacherChange = new EventEmitter<TeacherDetail>();

  new_school = new School('', true);
  new_teacher = new TeacherDetail(null, '', '', '', '', true, null, [], '');
  schools: Array<School> = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getActiveSchools();
  }

  public getActiveSchools() {
    this.apiService.fetchAll('schools').subscribe((data: Array<School>) => {
      // TODO: add item order customization
      // TODO: loop over and not have it be an object
      for (let i = 0; i < data.length; i++) {
        if (data[i].active)
          this.schools.push(data[i]);
      }
      if (this.schools.length > 0) this.new_school = this.schools[0];
    });
  }

  public onSubmit() {
    this.new_teacher.school = this.new_school;
    this.createTeacher();
    this.teacherChange.emit(this.new_teacher);
    this.new_teacher = new TeacherDetail(null, '', '', '', '', true, null, [], '');
  }

  public createTeacher() {
    // TODO: validation
    this.apiService.create("teachers", this.new_teacher).subscribe((response) => {
      console.log(response);
    });
  }
}
