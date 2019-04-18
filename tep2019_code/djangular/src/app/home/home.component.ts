import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService, AuthenticationService } from '../_services';
import { ApiService } from '../api.service';

<<<<<<< HEAD
@Component({ templateUrl: 'home.component.html' })
=======
@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
  })

>>>>>>> 3db638e7fda5bb5f903235eb6183e9e16ac7e1fa
export class HomeComponent {
    users: User[] = [];

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }
}