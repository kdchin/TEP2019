import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';
import { School } from '../models';

@Component({
  selector: 'app-school-create',
  templateUrl: './school-create.component.html',
  styleUrls: ['./school-create.component.css']
})
export class SchoolCreateComponent {
  @Output() schoolChange = new EventEmitter<School>();

  constructor(private apiService: ApiService) { }
  new_school = new School('', true);

  public onSubmit() {
    this.createSchool();
    this.schoolChange.emit(this.new_school);
    // TODO: reload page
    this.new_school = new School('', true);
  }

  public reload(){
    window.location.reload();
  }

  public createSchool() {
    this.apiService.create("schools", this.new_school).subscribe((response) => {
      console.log(response);
    });
  }
}
