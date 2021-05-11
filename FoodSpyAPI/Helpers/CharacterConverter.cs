
using FoodSpyAPI.Common;

namespace FoodSpyAPI.Helpers
{
	public class CharacterConverter
	{
		/// <summary>
		/// Converts ăâîșț and ĂÂÎȘȚ characters to aaist and AAIST respectively.
		/// </summary>
		/// <param name="name">Food name with diacritics</param>
		/// <returns>Converted food name with no diacritics</returns>
		internal static string ConvertDiacritics(string name)
		{
			// Convert ă to a, etc.
			string converted = "";
			foreach (char c in name) {
				char v = Alphabet.ConvertDiacritic(c);
				converted += v;
			}

			return converted;
		}
	}
}
