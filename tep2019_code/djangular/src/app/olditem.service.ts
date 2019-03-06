import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable()
export class ItemService {

    constructor(private http: HttpClient, private _userService: UserService) {
    }

    // Uses http.get() to load data from a single API endpoint
    list() {
        return this.http.get('/api/items');
    }

    // send a POST request to the API to create a new item post
    create(post, token) {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + this._userService.token
            })
        };
        return this.http.post('/api/items', JSON.stringify(post), httpOptions);
    }

}