
using System.Linq;

namespace FoodSpyAPI.Helpers
{
	public static class StringExtension
	{
		public static string FirstLetterUppercased(this string value)
		{
			return value.First().ToString().ToUpper() + value[1..].ToLower();
		}
	}
}
