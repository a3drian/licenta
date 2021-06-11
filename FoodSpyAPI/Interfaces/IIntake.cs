
using System;

namespace FoodSpyAPI.Interfaces
{
	public interface IIntake
	{
		string Email { get; set; }

		double Calories { get; set; }

		// double TargetCalories { get; set; }

		DateTime CreatedAt { get; set; }

		// List<MealModel> Meals { get; set; }
	}
}