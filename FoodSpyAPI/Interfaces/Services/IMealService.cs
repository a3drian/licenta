
using System.Collections.Generic;
using System.Threading.Tasks;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Interfaces.Services
{
	public interface IMealService
	{
		public Task<List<Meal>> GetMeals();

		public Task<List<Meal>> GetUnpopulatedMeals();

		public Task<Meal> GetMealById(string id);

		public Task<Meal> GetUnpopulatedMealById(string id);

		public Task<Meal> AddMeal(Meal meal);

		public Task<bool> UpdateMeal(Meal meal);

		public Task<bool> DeleteMeal(Meal meal);

		public Task<List<Meal>> SearchMealsByType(string type);

		public double CalculateCalories(Meal result);

		public double CalculateCalories(List<Meal> meals);
	}
}
