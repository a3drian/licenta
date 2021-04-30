
using System.Collections.Generic;

namespace FoodSpyAPI.Common
{
	public enum MealType
	{
		Breakfast = 1,
		Lunch = 2,
		Dinner = 3,
		Snack = 4
	}

	public static class MealTypes
	{
		public static Dictionary<string, uint> GetMealTypesOrder()
		{
			Dictionary<string, uint> order = new Dictionary<string, uint>()
			{
				{ MealType.Breakfast.ToString(), (int)MealType.Breakfast },
				{ MealType.Lunch.ToString(), (int)MealType.Lunch },
				{ MealType.Dinner.ToString(), (int)MealType.Dinner },
				{ MealType.Snack.ToString(), (int)MealType.Snack }
			};

			return order;
		}

	}
}
