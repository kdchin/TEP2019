import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';
import { Teacher, School } from '../models';
import { setEnvironment } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-teacher-create',
  templateUrl: './teacher-create.component.html',
  styleUrls: ['./teacher-create.component.css']
})
export class TeacherCreateComponent {
  @Output() teacherChange = new EventEmitter<Teacher>();

  constructor(private apiService: ApiService) { }

  new_teacher = new Teacher(null, '', '', '', '', true, null);
  school = new School('', true);

  public onSubmit() {
    this.new_teacher.school = this.school;
    this.createTeacher();
    this.teacherChange.emit(this.new_teacher);
    this.new_teacher = new Teacher(null, '', '', '', '', true, null);
  }

  public createTeacher() {
    // TODO: validation
    this.apiService.create("teachers", this.new_teacher).subscribe((response) => {
      console.log(response);
    });
  }
}
