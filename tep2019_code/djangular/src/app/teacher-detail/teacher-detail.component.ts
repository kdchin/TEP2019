import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { TeacherDetail, School } from '../models';
import { ApiService } from '../api.service';
import { PhonePipe } from '../phone.pipe';
import { BoolPipe } from '../bool.pipe';

@Component({
  selector: 'app-teacher-detail',
  templateUrl: './teacher-detail.component.html',
  styleUrls: ['./teacher-detail.component.css']
})
export class TeacherDetailComponent implements OnInit {
  teacher: TeacherDetail;
  phonePipe = new PhonePipe();
  activePipe = new BoolPipe();
  all_schools = [];
  new_school = new School(null, '', true);

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getTeacher();
    this.getAllSchools();
  }
  public getAllSchools() {
    this.apiService.fetchAll('schools').subscribe((data: Array<School>) => {
      // TODO: add item order customization
      // TODO: loop over and not have it be an object
      let all_schools = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].active)
          all_schools.push(data[i]);
      }
      this.all_schools = all_schools;
    });
  }
  getSchool() {
    return this.teacher.school;
  }

  getTeacher(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.apiService.fetchOne("teachers", id).subscribe((teacher: TeacherDetail) => this.teacher = teacher);
  }

  deleteTeacher(teacher: TeacherDetail) {
    this.apiService.delete("teachers", this.teacher.id).subscribe();
    this.location.back();
  }

  updateTeacher(attr: string) {
    return (newValue) => {
      this.teacher[attr] = newValue;
      this.apiService.update('teacher_update', this.teacher).subscribe();
    }
  }

  public alerter(teacher: TeacherDetail) {
    let r = confirm("Are you sure you would like to delete this teacher?");
    if (r == true) {
      this.deleteTeacher(teacher)
    }
  }

  goBack(): void {
    this.location.back();
  }
}