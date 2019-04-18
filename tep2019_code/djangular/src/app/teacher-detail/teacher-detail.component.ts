import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Teacher } from '../models';
import { ApiService }  from '../api.service';
<<<<<<< HEAD
=======
import { ResourceLoader } from '@angular/compiler';
>>>>>>> 3db638e7fda5bb5f903235eb6183e9e16ac7e1fa

@Component({
  selector: 'app-teacher-detail',
  templateUrl: './teacher-detail.component.html',
  styleUrls: ['./teacher-detail.component.css']
})
export class TeacherDetailComponent implements OnInit {
  teacher: Teacher;
 
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
    this.apiService.fetchOne("teachers", id).subscribe((teacher: Teacher) => this.teacher = teacher);
  }

  deleteTeacher(teacher: Teacher) {
    this.apiService.delete("teachers", this.teacher.id).subscribe();
    this.location.back();
  }

  goBack(): void {
    this.location.back();
  }
}