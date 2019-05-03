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

  selectedImageFile = '';
  school_columns = 1;
  teacher_columns = 6; // give: fname/lname/email/phone/school/address, need: id, fname, lname, email, phone, active, school, orders, address
  csvRecords = [];
  schools = [];
  school_names = [];
  teachers = [];
  teacher_valid = [];
  teacher_edited = [];
  orig_schools = [];

  constructor(private _router: Router,
    private _fileUtil: FileUtil,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.getSchools();
    this.getTeachers();
  }

  getSchools() {
    this.apiService.fetchAll('schools').subscribe((schools: Array<School>) => {
      this.schools = schools;
      this.school_names = lodash.map(this.schools, school => school.name.toLowerCase());
    });
  }

  getTeachers() {
    this.apiService.fetchAll('teachers').subscribe((teachers: Array<Teacher>) => {
      this.teachers = lodash.map(teachers, teacher => teacher.email);
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
    this.teacher_valid = [];
    this.teacher_edited = [];
  }

  isEmptyCSV() {
    return this.csvRecords.length === 0;
  }

  isTeacherCSV() {
    return !this.isEmptyCSV() && this.csvRecords[0].length === this.teacher_columns;
  }

  isSchoolCSV() {
    return !this.isEmptyCSV() && this.csvRecords[0].length === this.school_columns;
  }


  columnsAreConsistent(data, expected_length) {
    for (let i = 0; i < data.length; i++) {
      let data = this.csvRecords[i];
      if (!data || data.length !== expected_length)
        return false;
    }
    return true;
  }


  // school index is 5
  changeTeacher(i, newValue: School) {
    if (newValue) {
      this.csvRecords[i][5] = newValue.name;
      this.teacher_valid[i][1] = true;
      this.teacher_edited[i] = true;
    }
  }



  teacherHasDuplicates(i) {
    let cur_emails = lodash.map(this.csvRecords, data => data[2].toLowerCase());
    let this_email = this.csvRecords[i][2].toLowerCase();
    return lodash.sumBy(cur_emails, (email) => email === this_email ? 1 : 0) > 1;
  }

  teacherIsValid(i) {
    if (this.teacher_valid.length === 0 && this.csvRecords.length === 0) return [true, true];
    if (this.teacher_valid.length === 0 && this.csvRecords.length > 0) {
      this.orig_schools = lodash.map(this.csvRecords, data => data[5]);
      let valid = [];
      let edited = [];
      for (let i = 0; i < this.csvRecords.length; i++) {
        let email = this.csvRecords[i][2];
        let school = this.csvRecords[i][5].toLowerCase();
        valid.push([!this.teachers.includes(email), this.school_names.includes(school), !this.teacherHasDuplicates(i)]);
        edited.push(false);
      }
      this.teacher_edited = edited;
      this.teacher_valid = valid;
    }
    return this.teacher_valid[i][0] && this.teacher_valid[i][1] && this.teacher_valid[i][2];
  }

  recomputeDuplicates() {
    if (this.teacher_valid.length === 0 && this.csvRecords.length > 0) {
      this.teacherIsValid(0);
    }
    for (let i = 0; i < this.teacher_valid.length; i++) {
      this.teacher_valid[i][2] = !this.teacherHasDuplicates(i);
    }
  }

  teacherIsUnique(i) {
    if (this.teacher_valid.length === 0 && this.csvRecords.length > 0) {
      this.teacherIsValid(i);
    }
    return this.teacher_valid[i][2];
  }

  teacherIsEdited(i) {
    if (this.teacher_valid.length === 0 && this.csvRecords.length > 0) {
      this.teacherIsValid(i);
    }
    return this.teacher_edited[i];
  }

  teacherSchoolIsValid(i) {
    if (this.teacher_valid.length === 0 && this.csvRecords.length > 0) {
      this.teacherIsValid(i);
    }
    return this.teacher_valid[i][1];
  }

  teacherEmailIsValid(i) {
    if (this.teacher_valid.length === 0 && this.csvRecords.length > 0) {
      this.teacherIsValid(i);
    }
    return this.teacher_valid[i][0];
  }

  teachersAreValid() {
    if (this.isEmptyCSV() || !this.columnsAreConsistent(this.csvRecords, this.teacher_columns))
      return false;
    for (let i = 0; i < this.csvRecords.length; i++) {
      if (!this.teacherIsValid(i))
        return false;
    }
    return true;
  }

  schoolIsDuplicate(school_name) {
    return lodash.sumBy(lodash.map(this.csvRecords, row => row[0].toLowerCase()), name => name === school_name ? 1 : 0) > 1;
  }

  schoolIsValid(school_row) {
    let name = school_row[0].toLowerCase();
    return !this.school_names.includes(name) && !this.schoolIsDuplicate(name);
  }

  schoolsAreValid() {
    if (this.isEmptyCSV() || !this.columnsAreConsistent(this.csvRecords, this.school_columns))
      return false;
    for (let i = 0; i < this.csvRecords.length; i++) {
      let data = this.csvRecords[i];
      if (!this.schoolIsValid(data))
        return false;
    }
    return true;
  }

  getSchool(school_name) {
    for (let i = 0; i < this.schools.length; i++) {
      if (this.school_names[i] === school_name.toLowerCase()) {
        return this.schools[i];
      }
    }
  }

  uploadTeachers() {
    if (!this.teachersAreValid()) {
      this.fileReset();
      return;
    }
    for (let i = 0; i < this.csvRecords.length; i++) {
      let data = this.csvRecords[i];
      let school = this.getSchool(data[5]);
      let new_teacher = new Teacher(null, data[0], data[1], data[2], data[3], true, school, data[4]);
      this.apiService.create('teachers', new_teacher).subscribe((result: Teacher) => {
        this.teachers.push(result.email);
      });
    }
    this.fileReset();
  }

  uploadSchools() {
    if (!this.schoolsAreValid()) {
      this.fileReset();
      return;
    }
    for (let i = 0; i < this.csvRecords.length; i++) {
      let new_school = new School(null, this.csvRecords[i][0], true);// schools only have names
      this.apiService.create('schools', new_school).subscribe((result: School) => {
        this.schools.push(result);
        this.school_names.push(result.name.toLowerCase())
      });
    }
    this.fileReset();
  }

  deleteRecord(i: number) {
    if (i < this.csvRecords.length) {
      if (this.isTeacherCSV()) {
        let isDuplicate = !this.teacher_valid[i][2];
        this.csvRecords.splice(i, 1);
        this.teacher_valid.splice(i, 1);
        this.teacher_edited.splice(i, 1);
        if (isDuplicate)
          this.recomputeDuplicates();
      } else {
        this.csvRecords.splice(i, 1);
      }
      if (this.csvRecords.length === 0) this.fileReset();
    }
  }
}