import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'djangular';

  
}

/*
import { Component, OnInit } from '@angular/core';
import { ItemService } from './item.service';
import { UserService } from './user.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public user: any;

  public items;
  public new_item: any;

  constructor(private _itemService: ItemService, private _userService: UserService) { }

  ngOnInit() {
    this.getItems();
    this.new_item = {};
    this.user = {
      username: '',
      password: ''
    };
  }

  login() {
    this._userService.login({ 'username': this.user.username, 'password': this.user.password });
  }

  refreshToken() {
    this._userService.refreshToken();
  }

  logout() {
    this._userService.logout();
  }

  getItems() {
    this._itemService.list().subscribe(
      // the first argument is a function which runs on success
      data => {
        this.items = data;
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading items')
    );
  }

  createItem() {
    this._itemService.create(this.new_item, this.user.token).subscribe(
      data => {
        // refresh the list
        this.getItems();
        return true;
      },
      error => {
        console.error('Error saving!');
        return throwError(error);
      }
    );
  }
}
*/