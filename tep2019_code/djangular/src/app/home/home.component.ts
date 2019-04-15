import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService, AuthenticationService } from '../_services';
import { ApiService } from '../api.service';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    users: User[] = [];

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }
}