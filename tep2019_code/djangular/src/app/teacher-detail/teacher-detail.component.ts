import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { TeacherDetail } from '../models';
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

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getTeacher();
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

  goBack(): void {
    this.location.back();
  }
}