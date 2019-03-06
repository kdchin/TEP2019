import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class APIService {
  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.API_URL = 'http://localhost:8000/api';
  }

  // items methods
  fetchAll(type) {
    return this.httpClient.get(`${this.API_URL}/${type}`);
  }

  createRecord(type, jsonData) {
    return this.httpClient.post(`${this.API_URL}/type/`, jsonData);
  }
}