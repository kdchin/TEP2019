import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Teacher } from '../models';

@Component({
  selector: 'app-teacher-create',
  templateUrl: './teacher-create.component.html',
  styleUrls: ['./teacher-create.component.css']
})
export class TeacherCreateComponent {

  constructor(private apiService: ApiService) { }

  new_teacher = new Teacher('', '', '', '', true);

  public onSubmit() {
    this.createTeacher();
    // TODO: reload page
    this.new_teacher = new Teacher('', '', '', '', true);
  }

  public createTeacher() {
    this.apiService.create("teachers", this.new_teacher).subscribe((response) => {
      console.log(response);
    });
  }
}
