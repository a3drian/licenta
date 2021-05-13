
namespace FoodSpyAPI.Common
{
	public class Alphabet
	{
		public static string EMPTY_SPACES = " ";

		public static string EN_ALPHABET = "abcdefghijklmnopqrstuvwxyz";
		public static string EN_ALPHABET_UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

		public static string RO_ALPHABET = "ăâîșț";
		public static string RO_ALPHABET_UPPERCASE = "ĂÂÎȘȚ";

		public static string NUMBERS = "0123456789";

		public static string ALLOWED_CHARACTERS = EMPTY_SPACES + EN_ALPHABET + EN_ALPHABET_UPPERCASE + RO_ALPHABET + RO_ALPHABET_UPPERCASE + NUMBERS;

		public static char ConvertDiacritic(char c)
		{
			switch (c) {
				case 'ă':
				case 'â': {
						return 'a';
					}
				case 'î': {
						return 'i';
					}
				case 'ș': {
						return 's';
					}
				case 'ț': {
						return 't';
					}
				case 'Ă':
				case 'Â': {
						return 'A';
					}
				case 'Î': {
						return 'I';
					}
				case 'Ș': {
						return 'S';
					}
				case 'Ț': {
						return 'T';
					}
				default: {
						return c;
					}
			}
		}

	}
}
