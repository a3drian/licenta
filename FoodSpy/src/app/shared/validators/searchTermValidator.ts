import { FULL_ALPHABET } from '../Alphabet';

export { isValidSearchTerm };

function isValidSearchTerm(term: string): boolean {

   const aux = term.split('');
   const uniqueOriginalCharacters = new Set(aux);
   // console.log('uniqueOriginalCharacters:', uniqueOriginalCharacters);

   const filteredCharacters = aux.filter(a => FULL_ALPHABET.includes(a));
   // console.log('filteredCharacters:', filteredCharacters);

   const filteredUniqueCharacters = new Set(filteredCharacters);

   // console.log('filteredUniqueCharacters:', filteredUniqueCharacters);

   if (uniqueOriginalCharacters.size === filteredUniqueCharacters.size) {
      // TO DO: can add check to sort the set and verify letters one by one
      return true;
   }

   return false;
}