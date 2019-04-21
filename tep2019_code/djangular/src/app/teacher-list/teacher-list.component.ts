import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { TeacherDetail, OrderTeacher } from '../models';
import { PhonePipe } from '../phone.pipe';
import { BoolPipe } from '../bool.pipe';


@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit {
  selectedTeacher: TeacherDetail;

  searchText = '';
  teachers: Array<TeacherDetail> = [];
  shouldShowCreate = false;
  phonePipe = new PhonePipe();
  activePipe = new BoolPipe();
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getTeachers();
  }

  public toggleShowCreate() {
    this.shouldShowCreate = !this.shouldShowCreate;
  }

  public onSelect(teacher: TeacherDetail) {
    this.selectedTeacher = teacher;
  }

  public updateTeacher(i: number, attr: string) {
    return (new_value) => {
      // TODO check validity of email/phone?
      let teacher = this.teachers[i];
      teacher[attr] = new_value;
      this.apiService.update("teachers", teacher).subscribe();
    }
  }

  public onNewTeacher(newTeacher: TeacherDetail) {
    this.teachers.push(newTeacher);
    this.toggleShowCreate();
  }

  public getTeachers() {
    this.apiService.fetchAll("teachers").subscribe((data: Array<TeacherDetail>) => {
      this.teachers = data;
    });
  }
}
