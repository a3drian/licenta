﻿
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using FoodSpyAPI.Common;
using FoodSpyAPI.DTOs;

namespace FoodSpyAPI.Helpers
{
	public static class Validator
	{
		#region Constants
		private static double MIN_MEAL_QUANTITY = 0.1;
		private static double MAX_MEAL_QUANTITY = 1000.0;
		private static double MIN_CALORIES = 1;
		private static double MAX_CALORIES = 10000.0;
		#endregion

		/// <summary>
		/// Determines whether a given id is of type "string".
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <returns>
		///   <c>true</c> if id is of type string, is not null and does not contain whitespace; otherwise, <c>false</c>.
		/// </returns>
		internal static bool IsValidAndNotEmptyString(string id)
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

		private static bool IsEmptyOrNullString(string str)
		{
			if (
				 str == null ||
				 string.IsNullOrWhiteSpace(str) ||
				 str.Length == 0 ||
				 str.All(char.IsWhiteSpace)
			) {
				return true;
			}

			return false;
		}

		private static bool IsEmptySearchTerm(string searchTerm)
		{
			if (IsEmptyOrNullString(searchTerm)) {
				return true;
			}

			return false;
		}

		internal static bool IsValidSearchTerm(string searchTerm)
		{
			if (IsEmptySearchTerm(searchTerm)) {
				return false;
			}

			if (!(searchTerm.GetType() == typeof(string))) {
				return false;
			}

			return true;
		}

		internal static bool IsValidEmail(string email)
		{
			if (string.IsNullOrWhiteSpace(email)) {
				return false;
			}

			try {
				// Normalize the domain
				email = Regex.Replace(email, @"(@)(.+)$", DomainMapper,
											 RegexOptions.None, TimeSpan.FromMilliseconds(200));

				// Examines the domain part of the email and normalizes it.
				string DomainMapper(Match match)
				{
					// Use IdnMapping class to convert Unicode domain names.
					var idn = new IdnMapping();

					// Pull out and process domain name (throws ArgumentException on invalid)
					string domainName = idn.GetAscii(match.Groups[2].Value);

					return match.Groups[1].Value + domainName;
				}
			} catch (RegexMatchTimeoutException e) {
				Console.WriteLine($"IsValidEmail.RegexMatchTimeoutException: {e}");
				return false;
			} catch (ArgumentException e) {
				Console.WriteLine($"IsValidEmail.ArgumentException: {e}");
				return false;
			}

			try {
				return Regex.IsMatch(email,
					 @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
					 RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
			} catch (RegexMatchTimeoutException) {
				return false;
			}
		}

		internal static bool IsValidDate(DateTime date)
		{
			if (date == null) {
				return false;
			}

			if (date.Year == 1 &&
				 date.Month == 1 &&
				 date.Day == 1
			) {
				return false;
			}

			return true;
		}

		internal static bool IsValidGuidArray(List<Guid> arrayOfIDs)
		{
			if (arrayOfIDs == null) {
				return false;
			}

			if (arrayOfIDs.GetType().IsArrayOf<Guid>()) {
				return false;
			}

			bool allUnique = arrayOfIDs.GroupBy(id => id).All(g => g.Count() == 1);
			if (!allUnique) {
				return false;
			}

			return true;
		}

		internal static bool IsValidSortOrder(SortOrder sortOrder)
		{
			bool valid = Enum.IsDefined(typeof(SortOrder), sortOrder);
			if (!valid) { return false; }

			return true;
		}

		internal static bool IsValidSearchByEmailQuery(SearchByEmailOptions searchQuery)
		{
			string email = searchQuery.Email;
			if (!IsValidEmail(email)) { return false; }

			SortOrder sortOrder = searchQuery.SortOrder;
			if (!IsValidSortOrder(sortOrder)) { return false; }

			return true;
		}

		internal static bool IsValidSearchByEmailAndDateQuery(SearchByEmailAndDateOptions searchQuery)
		{
			string email = searchQuery.Email;
			if (!IsValidEmail(email)) { return false; }

			DateTime createdAt = searchQuery.CreatedAt;
			if (!IsValidDate(createdAt)) { return false; }

			return true;
		}

		internal static bool IsValidMealType(string type)
		{
			if (!IsValidSearchTerm(type)) {
				return false;
			}

			string firstLetterUppercased = type.FirstLetterUppercased();

			bool valid = Enum.IsDefined(typeof(MealType), firstLetterUppercased);
			if (!valid) { return false; }

			return true;
		}

		internal static bool IsValidFoodName(string name)
		{
			if (!IsValidSearchTerm(name)) {
				return false;
			}

			bool valid = name.All(letter => Alphabet.ALLOWED_CHARACTERS.Contains(letter));

			return valid;
		}

		internal static bool IsValidGuid(string id)
		{
			bool valid = Guid.TryParse(id, out _);
			return valid;
		}

		internal static bool IsValidMealQuantity(double quantity)
		{
			if (
				quantity >= MIN_MEAL_QUANTITY &&
				quantity <= MAX_MEAL_QUANTITY
			) {
				return true;
			}
			return false;
		}

		internal static bool IsValidFoodUnit(string unit)
		{
			string firstLetterUppercased = unit.FirstLetterUppercased();

			bool valid = Enum.IsDefined(typeof(FoodUnit), firstLetterUppercased);
			if (!valid) { return false; }

			return true;
		}

		internal static bool IsValidIntakeCalories(double calories)
		{
			if (
				calories >= MIN_CALORIES &&
				calories <= MAX_CALORIES
		) {
				return true;
			}
			return false;
		}
	}

	internal static class TypeExtensions
	{
		internal static bool IsArrayOf<T>(this Type type)
		{
			return type == typeof(T[]);
		}
	}
}
