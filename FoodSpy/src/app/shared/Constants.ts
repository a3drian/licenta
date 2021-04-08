export { Constants }

class Constants {
   static isInDebugMode: boolean = true;
   static APIEndpoints =
      {
         REGISTER_URL: '/auth/register',
         LOGIN_URL: '/auth/login',
         LOGOUT_REDIRECT_URL: '/auth'
      };
}