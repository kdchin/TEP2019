import { Component, OnInit, Input } from '@angular/core';
import { Teacher } from '../models';

@Component({
  selector: 'app-teacher-detail',
  templateUrl: './teacher-detail.component.html',
  styleUrls: ['./teacher-detail.component.css']
})
export class TeacherDetailComponent implements OnInit {
  @Input() teacher: Teacher;
 
  constructor() { }
 
  ngOnInit() {
  }

}
