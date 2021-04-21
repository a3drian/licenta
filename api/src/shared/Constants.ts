import { environment } from 'foodspy-shared';

export { Constants };

class Constants {
   static IN_DEBUG_MODE: boolean = true;
   static APIEndpoints =
      {
         REGISTER_URL: environment.REGISTER_URL,
         LOGIN_URL: environment.LOGIN_URL,
      };
}