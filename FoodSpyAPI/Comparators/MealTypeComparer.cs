
using System.Collections.Generic;
using FoodSpyAPI.Common;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Comparators
{
	internal class MealTypeComparer : IComparer<Meal>
	{
		private readonly Dictionary<string, uint> order = MealTypes.GetMealTypesOrder();

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
