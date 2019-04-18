import { Component, OnInit } from '@angular/core';
import { ValPass } from '../models';
import { ApiService } from '../api.service';
import * as crypto from 'crypto-js';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-pwd-generator',
  templateUrl: './pwd-generator.component.html',
  styleUrls: ['./pwd-generator.component.css']
})
export class PwdGeneratorComponent implements OnInit {

  val_pass: ValPass = new ValPass(null, '', new Date());
  new_pwd: string = '';
  key = environment.val_pass_key;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getMostRecentPassword();
  }

  getPwd(digest) {
    let bytes = crypto.AES.decrypt(digest.digest, this.key);
    return bytes.toString(crypto.enc.Utf8);
  }

  getDigest(pwd: string) {
    return crypto.AES.encrypt(pwd, this.key).toString();
  }

  submitPassword() {
    if (this.new_pwd.length >= 5) {
      let pwd = new ValPass(null, this.getDigest(this.new_pwd), new Date());
      this.apiService.create('validation_passwords', pwd).subscribe();
      this.val_pass.digest = pwd.digest;
      this.new_pwd = '';
    }
  }

  getMostRecentPassword() {
    this.apiService.fetchAll('validation_passwords').subscribe((data: Array<ValPass>) => {
      let mostRecent = null;
      for (let i = 0; i < data.length; i++) {
        if (!mostRecent || (data[i].uploaded_date > mostRecent.uploaded_date))
          mostRecent = data[i];
      }
      if (mostRecent)
        this.val_pass = mostRecent;
    })
  }
}
