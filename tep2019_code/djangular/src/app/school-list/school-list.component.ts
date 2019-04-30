import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { School } from '../models';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SchoolCreateComponent } from '../school-create/school-create.component';
import { BoolPipe } from '../bool.pipe';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.css']
})
export class SchoolListComponent implements OnInit {

  searchText = '';
  schools: Array<School> = [];
  shouldShowCreate = false;
  p;
  activePipe = new BoolPipe();
  constructor(private apiService: ApiService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getSchools();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SchoolCreateComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.getItems(); shows double of each item - put it in so user can see new item in table
    });
  }

  updateSchool(i: number, attr: string) {
    return (newValue) => {
      this.schools[i][attr] = newValue;
      this.apiService.update('schools', this.schools[i]).subscribe();
    }
  }


  public onNewSchool(newSchool: School) {
    this.schools.push(newSchool);
    this.toggleShowCreate();
  }

  public toggleShowCreate() {
    this.shouldShowCreate = !this.shouldShowCreate;
  }

  public getSchools() {
    this.apiService.fetchAll("schools").subscribe((data: Array<School>) => {
      this.schools = data;
    });
  }

}
