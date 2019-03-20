import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Teacher } from '../models';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit {


  private teachers: Array<Teacher> = [];
  private shouldShowCreate = false;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getTeachers();
  }

  public toggleShowCreate() {
    this.shouldShowCreate = !this.shouldShowCreate;
  }

  public onNewTeacher(newTeacher: Teacher) {
    this.teachers.push(newTeacher);
    this.toggleShowCreate();
  }

  public getTeachers() {
    this.apiService.fetchAll("teachers").subscribe((data: Array<Teacher>) => {
      this.teachers = data;
    });
  }
}
