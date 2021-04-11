import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { UserService } from './auth/user.service';
import { log } from './shared/Logger';
import { Constants } from './shared/Constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isInDebugMode: boolean = Constants.isInDebugMode;

  title = 'FoodSpy';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    log('app.ts', this.ngOnInit.name, 'called autoLogin()');
    this.authService.autoLogin();
    this.authService.user.subscribe(
      (user) => {
        this.userService.user = user;
        if (user) {
          this.userService.isAuthenticated = true;
          this.userService.authenticatedUserEmail = user.email;
        }
      }
    )
  }
}
