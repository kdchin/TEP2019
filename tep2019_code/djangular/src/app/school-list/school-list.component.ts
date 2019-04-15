import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { School } from '../models';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.css']
})
export class SchoolListComponent implements OnInit {

  searchText = '';
  schools: Array<School> = [];
  shouldShowCreate = false;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getSchools();
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
