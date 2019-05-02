import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { TeacherDetail } from '../models';
import { PhonePipe } from '../phone.pipe';
import { BoolPipe } from '../bool.pipe';
import { MatDialog } from '@angular/material';
import { TeacherCreateComponent } from '../teacher-create/teacher-create.component';


@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit {
  searchText = '';
  teachers: Array<TeacherDetail> = [];
  phonePipe = new PhonePipe();
  activePipe = new BoolPipe();
  p;
  constructor(private apiService: ApiService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getTeachers();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TeacherCreateComponent, {
      width: '400px',
      data: { teachers: this.teachers }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onNewTeacher(result);
    });
  }

  public onNewTeacher(newTeacher: TeacherDetail) {
    if (!newTeacher) return;
    this.teachers.push(newTeacher);
    this.apiService.create("teachers", newTeacher).subscribe();
  }

  public updateTeacher(i: number, attr: string) {
    return (new_value) => {
      // TODO check validity of email/phone?
      let teacher = this.teachers[i];
      teacher[attr] = new_value;
      this.apiService.update("teachers", teacher).subscribe();
    }
  }

  public getTeachers() {
    this.apiService.fetchAll("teachers").subscribe((data: Array<TeacherDetail>) => {
      this.teachers = data;
    });
  }
}
