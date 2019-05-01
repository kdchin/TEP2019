import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { FileUtil } from './file.util';
import { Constants } from './test.constants';
import { ApiService } from '../api.service';
import { Teacher, School } from '../models';
import * as lodash from "lodash";
// from https://javabypatel.blogspot.com/2017/07/read-csv-file-in-angular2.html
@Component({
  selector: 'app-csv-import',
  templateUrl: './csv-import.component.html',
  styleUrls: ['./csv-import.component.css']
})
export class CsvImportComponent implements OnInit {
  @ViewChild('fileImportInput')
  fileImportInput: any;

  csvRecords = [];
  school_columns = 1;
  // teacher_columns = 4;
  schools = [];

  constructor(private _router: Router,
    private _fileUtil: FileUtil,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.getSchools();
  }

  getSchools() {
    this.apiService.fetchAll('schools').subscribe((schools: Array<School>) => {
      this.schools = schools;
    });
  }

  // METHOD CALLED WHEN CSV FILE IS IMPORTED
  fileChangeListener($event): void {

    var text = [];
    var files = $event.srcElement.files;

    if (Constants.validateHeaderAndRecordLengthFlag) {
      if (!this._fileUtil.isCSVFile(files[0])) {
        alert("Please import valid .csv file.");
        this.fileReset();
      }
    }

    var input = $event.target;
    var reader = new FileReader();
    reader.readAsText(input.files[0]);

    reader.onload = (data) => {
      let csvData = reader.result;
      let csvRecordsArray = (csvData as string).split(/\r\n|\n/);

      var headerLength = -1;
      if (Constants.isHeaderPresentFlag) {
        let headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, Constants.tokenDelimeter);
        headerLength = headersRow.length;
      }

      this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray,
        headerLength, Constants.validateHeaderAndRecordLengthFlag, Constants.tokenDelimeter);
      // console.log(this.csvRecords);

      if (this.csvRecords == null) {
        //If control reached here it means csv file contains error, reset file.
        this.fileReset();
      }
    }

    reader.onerror = function () {
      alert('Unable to read ' + input.files[0]);
    };
  };

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }

  // TODO: finish this
  teachersAreValid() {
    if (this.csvRecords.length === 0) return false;
    this.apiService.fetchAll('teachers').subscribe((teachers: Array<Teacher>) => {
      let existing_emails = lodash.map(teachers, teacher => teacher.email);
      for (let i = 0; i < this.csvRecords.length; i++) {
        let data = this.csvRecords[i];
        // let teacher = new Teacher(null, data[1], data[2], data[3]);
      }
    });
  }

  schoolsAreValid() {
    if (this.csvRecords.length === 0) {
      alert("CSV is empty");
      return false;
    }
    let existing_schools = lodash.map(this.schools, school => school.name.toLowerCase());
    let matches = [];
    for (let i = 0; i < this.csvRecords.length; i++) {
      let data = this.csvRecords[i];
      if (data.length !== this.school_columns) {
        alert(`Number of lines in line ${i} (${data.length}) does not match expected length (${this.school_columns})`);
        return false;
      } else if (existing_schools.includes(data[0].toLowerCase())) {
        matches.push(data[0]);
      }
      // let teacher = new Teacher(null, data[1], data[2], data[3]);
    }
    if (matches.length === 0) return true;
    else {
      alert(`Upload failed. The following schools already exist:\n${matches.join("\n")}`);
      return false;
    }
  }

  uploadTeachers() {
  }

  uploadSchools() {
    console.log(this.csvRecords);
    if (!this.schoolsAreValid()) {
      this.fileReset();
      return;
    }
    for (let i = 0; i < this.csvRecords.length; i++) {
      let new_school = new School(null, this.csvRecords[i][0], true);// schools only have names
      this.apiService.create('schools', new_school).subscribe();
    }
    this.fileReset();
  }
}