import { Constants } from './Constants';

export { log };
const log = function (
   className: string,
   caller: string,
   message: string,
   object?: any
): void {
   if (Constants.IN_DEBUG_MODE) {
      if (!(caller.includes('(') || caller.includes(')'))) {
         caller = caller + '()';
      }
      if (object) {
         console.log(`${className}.${caller}: ${message}`, object);
      } else {
         console.log(`${className}.${caller}: ${message}`, '');
      }
   }
};