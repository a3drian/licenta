export { Constants }

class Constants {
   static isInDebugMode: boolean = false;
   static APIEndpoints =
      {
         REGISTER_URL: '/auth/register',
         LOGIN_URL: '/auth/login',
         LOGOUT_REDIRECT_URL: '/auth',

         FOODS_BASE_URL: '/api/foods',
         FOODS_SERACH_URL: '/search?name=',

         MEALS_BASE_URL: '/api/meals',
         MEALS_SEARCH_URL: '/api/meals/search/'
      };
}