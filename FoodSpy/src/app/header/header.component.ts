import { Component, OnDestroy, OnInit } from '@angular/core';
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../auth/user.service';
import { Router } from '@angular/router';
import { IUser } from 'foodspy-shared';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  isAuthenticated: boolean = false;
  authenticatedUserEmail: string = '';
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
      this.authenticatedUserEmail = this.user.email;
      this.isAuthenticated = this.userService.isAuthenticated;
    }
    log('dashboard.ts', this.ngOnInit.name, 'this.authenticatedUserEmail', this.authenticatedUserEmail);
  }

  onLogout(): void {
    this.authService.logout();
  }

  logIn(): void {
    this.router.navigate([Constants.APIEndpoints.AUTH_URL])
  }

}
