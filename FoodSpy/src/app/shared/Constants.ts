import { environment } from 'foodspy-shared';

export { Constants };

class Constants {
   static IN_DEBUG_MODE: boolean = true;
   static APIEndpoints =
      {
         REGISTER_URL: environment.REGISTER_URL,
         LOGIN_URL: environment.LOGIN_URL,

         AUTH_URL: '/auth',
         LOGOUT_REDIRECT_URL: '/auth',

         FOODS_BASE_URL: '/api/db/foods',
         FOODS_SERACH_URL: '/search?name=',

         MEALS_BASE_URL: '/api/db/meals',
         MEALS_SEARCH_URL: '/api/db/meals/search/',

         INTAKES_BASE_URL: '/api/db/intakes',
         INTAKES_SEARCH_URL: '/api/db/intakes/search/',
         INTAKES_SEARCH_BY_EMAIL_AND_DATE: '/api/db/intakes/searchByEmailAndCreatedAt'
      };
}