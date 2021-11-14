import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Interfaces:
import { IUser } from 'foodspy-shared';
// Services:
import { AuthService } from '../auth/auth.service';
import { UserService } from '../auth/user.service';
// Shared:
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  isAuthenticated: boolean = false;
  userEmail: string = '';
  user: IUser | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.user = this.userService.user;
    if (this.user) {
      this.userEmail = this.user.email;
      this.isAuthenticated = this.userService.isAuthenticated;
      log('header.ts', this.ngOnInit.name, 'this.user, this.userEmail:', this.userEmail);
    }
    log('header.ts', this.ngOnInit.name, '!this.user, this.userEmail is empty!');
  }

  onLogout(): void {
    this.authService.logout();
  }

  logIn(): void {
    this.router
      .navigate([Constants.APIEndpoints.AUTH_URL])
      .catch(
        (error) => {
          log('header.ts', this.logIn.name, `Could not navigate to: ${Constants.APIEndpoints.AUTH_URL}`, error);
        }
      );
  }

}
