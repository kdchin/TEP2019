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
  p;
  activePipe = new BoolPipe();
  is_loading = true;
  constructor(private apiService: ApiService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getSchools();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SchoolCreateComponent, {
      width: '400px',
      data: { schools: this.schools }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onNewSchool(result);
    });
  }

  updateSchool(i: number, attr: string) {
    return (newValue) => {
      this.schools[i][attr] = newValue;
      this.apiService.update('schools', this.schools[i]).subscribe();
    }
  }

  public onNewSchool(newSchool: School) {
    if (!newSchool) return;
    this.schools.push(newSchool);
    this.apiService.create('schools', newSchool).subscribe();
  }


  public getSchools() {
    this.apiService.fetchAll("schools").subscribe((data: Array<School>) => {
      this.schools = data;
      this.is_loading = false;
    });
  }

}
