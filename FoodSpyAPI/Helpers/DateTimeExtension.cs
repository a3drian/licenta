
using System;

namespace FoodSpyAPI.Helpers
{
	public static class DateTimeExtension
	{
		public static string Print(this DateTime value)
		{
			return $"{value.Day}.{value.Month}.{value.Year} @ {value.ToShortTimeString()}";
		}
	}
}
