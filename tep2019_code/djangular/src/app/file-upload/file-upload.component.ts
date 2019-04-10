import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Waiver } from '../models';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  fileToUpload: File = null;
  mostRecentUpload: Waiver = null;
  constructor(private apiService: ApiService) { }
  ngOnInit() {
    this.getMostRecentUpload();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  getMostRecentUpload() {
    this.apiService.fetchAll('waivers').subscribe((data: Array<Waiver>) => {
      let mostRecent = null;
      for (let i = 0; i < data.length; i++) {
        if (!mostRecent || (data[i].uploaded_date > mostRecent.uploaded_date))
          mostRecent = data[i];
      }
      this.mostRecentUpload = mostRecent;
    })
  }

  isPdf() {
    return this.fileToUpload.name.split('.').pop() === 'pdf';
  }

  uploadFile() {
    if (this.fileToUpload && this.isPdf()) {
      this.apiService.uploadFile(this.fileToUpload).subscribe((data: Waiver) => {
        this.mostRecentUpload = data;
      });
      this.fileToUpload = null;
    }
  }

  formatFileName(file) {
    return file.replace(/^.*[\\\/]/, '');
  }

}
