import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/IUser';
import { log } from '../shared/Logger';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
   public user: IUser | null = null;
   public isAuthenticated: boolean = false;
   public authenticatedUserEmail: string = '';

   constructor(private authService: AuthService) {
      log('user.service.ts', 'constructor()', 'called autoLogin()');
      // this.authService.autoLogin();
   }
}