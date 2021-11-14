
using System;

namespace FoodSpyAPI.Helpers
{
	public static class DoubleExtension
	{
		private static double EQUALITY_THRESHOLD = 0.00001;

		public static bool AlmostEqualTo(this double value1, double value2)
		{
			return Math.Abs(value1 - value2) < EQUALITY_THRESHOLD;
		}
	}
}
