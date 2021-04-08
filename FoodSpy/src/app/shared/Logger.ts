import { Constants } from './Constants';

export { log }
const log = function (
   className: string,
   caller: string,
   message: string,
   object?: any
) {
   if (Constants.isInDebugMode) {
      if (object) {
         console.log(`${className}.${caller}: ${message}`, object);
      } else {
         console.log(`${className}.${caller}: ${message}`, '');
      }
   }
};