import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';
import { Teacher } from '../models';
import { setEnvironment } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-teacher-create',
  templateUrl: './teacher-create.component.html',
  styleUrls: ['./teacher-create.component.css']
})
export class TeacherCreateComponent {
  @Output() teacherChange = new EventEmitter<Teacher>();

  constructor(private apiService: ApiService) { }

  new_teacher = new Teacher('', '', '', '', true);

  public onSubmit() {
    this.createTeacher();
    this.teacherChange.emit(this.new_teacher);
    // TODO: reload page
    this.new_teacher = new Teacher('', '', '', '', true);
  }

  public createTeacher() {
    this.apiService.create("teachers", this.new_teacher).subscribe((response) => {
      console.log(response);
    });
  }
}
