import { environment } from 'foodspy-shared';

export { Constants };

class Constants {
   static IN_DEBUG_MODE: boolean = false;

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

   static DASHBOARD_URL: string = '/dashboard';
   static ADD_MEAL_URL: string = Constants.DASHBOARD_URL + '/add';

   static DEFAULT_TARGET_CALORIES: number = 2000;

   static MIN_MEAL_QUANTITY: number = 1;
   static MAX_MEAL_QUANTITY: number = 1000.0;
   static MIN_CALORIES: number = 100;
   static MAX_CALORIES: number = 10000;

   static DEFAULT_QUANTITY: number = 100;
   static DEFAULT_UNIT: string = 'grams';

   static MIN_PASSWORD_LENGTH: number = 3;
}