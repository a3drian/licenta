export { Constants }

class Constants {
   static IN_DEBUG_MODE: boolean = true;
   static APIEndpoints =
      {
         REGISTER_URL: '/auth/register',
         LOGIN_URL: '/auth/login',
         AUTH_URL: '/auth',
         LOGOUT_REDIRECT_URL: '/auth',

         FOODS_BASE_URL: '/api/foods',
         FOODS_SERACH_URL: '/search?name=',

         MEALS_BASE_URL: '/api/meals',
         MEALS_SEARCH_URL: '/api/meals/search/'
      };
}