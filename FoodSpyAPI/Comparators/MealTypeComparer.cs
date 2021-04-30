
using System.Collections.Generic;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Comparators
{
	internal class MealTypeComparer : IComparer<Meal>
	{
		private readonly Dictionary<string, uint> order = new Dictionary<string, uint>()
		{
			{ "Breakfast", 1 },
			{ "Lunch", 2 },
			{ "Dinner", 3 },
			{ "Snack", 4 },
		};

		public int Compare(Meal x, Meal y)
		{
			string typeX = x.Type;
			string typeY = y.Type;

			uint a = order[typeX];
			uint b = order[typeY];

			return a.CompareTo(b);
		}
	}
}
