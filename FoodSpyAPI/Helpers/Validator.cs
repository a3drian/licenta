
using System;
using System.Linq;

namespace FoodSpyAPI.Helpers
{
	public static class Validator
	{
		/// <summary>
		/// Determines whether an id of type "string" is valid.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <returns>
		///   <c>true</c> if id is of type string, is not null and does not contain whitespace; otherwise, <c>false</c>.
		/// </returns>
		public static bool IsValidId(string id)
		{
			if (
				 id.GetType() != typeof(string) ||
				 string.IsNullOrWhiteSpace(id) ||
				 id.Any(char.IsWhiteSpace)
			) {
				return false;
			}

			return true;
		}

		public static bool IsEmptySearchTerm(string searchTerm)
		{
			if (
				 searchTerm == null ||
				 string.IsNullOrWhiteSpace(searchTerm) ||
				 searchTerm.Length == 0 ||
				 searchTerm.All(char.IsWhiteSpace)
			) {
				return false;
			}

			return true;
		}

		internal static bool IsValid24DigitHexString(string id)
		{
			if (
				 id.Length != 24
			) {
				return false;
			}

			return true;
		}
	}
}
