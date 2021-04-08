import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { log } from './shared/Logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FoodSpy';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    log('app.ts', 'ngOnInit()', 'called autoLogin()');
    //this.authService.autoLogin();
  }
}
