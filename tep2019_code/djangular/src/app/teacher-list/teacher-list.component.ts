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
  shouldShowCreate = false;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getTeachers();
  }

  public getTeachers() {
    this.apiService.fetchAll("teachers").subscribe((data: Array<Teacher>) => {
      this.teachers = data;
    });
  }
}
