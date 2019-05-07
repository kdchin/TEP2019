import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private API_URL: string = 'http://localhost:8000/api';
  // private API_URL = 'https://infinite-wave-20988.herokuapp.com/api'
  private API_URL = environment.api_url;
  constructor(private httpClient: HttpClient) { }

  private add_pwd_to_header(pwd_guess) {
    let h = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    if (pwd_guess) h['Val-Password'] = pwd_guess;
    let httpOptions = {
      headers: new HttpHeaders(h)
    };
    return httpOptions;
  }

  fetchAll(type) {
    return this.httpClient.get(`${this.API_URL}/${type}`);
  }

  fetchOne(type, id) {
    return this.httpClient.get(`${this.API_URL}/${type}/${id}`);
  }

  create(type, jsonData, pwd_guess?: string) {
    if (type === 'teachers') {
      jsonData['address'] = jsonData['address'].replace(/,/g, ';');
    }
    return this.httpClient.post(`${this.API_URL}/${type}/`, jsonData, this.add_pwd_to_header(pwd_guess));
  }

  delete(type, id) {
    return this.httpClient.delete(`${this.API_URL}/${type}/${id}`);
  }

  update(type, jsonData, pwd_guess?: string) {
    if (type === 'teacher_update') {
      jsonData['address'] = jsonData['address'].replace(/,/g, ';');
    }
    return this.httpClient.put(`${this.API_URL}/${type}/${jsonData.id}`, jsonData, this.add_pwd_to_header(pwd_guess));
  }

  uploadFile(file) {
    let formData: FormData = new FormData();
    formData.append('file', file, file.name.replace(/^.*[\\\/]/, ''));
    return this.httpClient.post(this.API_URL + '/waivers/', formData);
  }
}
