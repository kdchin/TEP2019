import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment'
import { SignedRequest } from './models';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
    // 'Authorization': 'my-auth-token'
    'Accept': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private API_URL: string = 'http://localhost:8000/api';
  // private API_URL = 'http://127.0.0.1:8000/api';
  // private API_URL = 'https://infinite-wave-20988.herokuapp.com/api'
  private API_URL = environment.api_url;
  constructor(private httpClient: HttpClient) { }
  fetchAll(type) {
    return this.httpClient.get(`${this.API_URL}/${type}`);
  }

  fetchOne(type, id) {
    return this.httpClient.get(`${this.API_URL}/${type}/${id}`);
  }

  create(type, jsonData) {
    if (type === 'teachers') {
      jsonData['address'] = jsonData['address'].replace(/,/g, ';');
    }
    return this.httpClient.post(`${this.API_URL}/${type}/`, jsonData, httpOptions);
    // return this.httpClient.post(`${this.API_URL}/${type}/`, jsonData);
  }

  delete(type, id) {
    return this.httpClient.delete(`${this.API_URL}/${type}/${id}`);
  }

  update(type, jsonData) {
    if (type === 'teacher_update') {
      jsonData['address'] = jsonData['address'].replace(/,/g, ';');
    }
    return this.httpClient.put(`${this.API_URL}/${type}/${jsonData.id}`, jsonData);
  }

  uploadFile(file) {
    let formData: FormData = new FormData();
    formData.append('file', file, file.name.replace(/^.*[\\\/]/, ''));
    return this.httpClient.post(this.API_URL + '/waivers/', formData);
  }
}
