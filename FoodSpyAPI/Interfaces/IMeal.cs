
using System;

namespace FoodSpyAPI.Interfaces
{
	public interface IMeal
	{
		DateTime CreatedAt { get; set; }
		string Type { get; set; }
		//	List<MealFoodModel> MealFoods { get; set; }
	}
}
