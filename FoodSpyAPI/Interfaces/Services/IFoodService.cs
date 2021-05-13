
using System.Collections.Generic;
using System.Threading.Tasks;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Interfaces.Services
{
	public interface IFoodService
	{
		public Task<List<Food>> GetFoods();

		public Task<Food> GetFoodById(string id);

		public Task<Food> AddFood(Food food);

		public Task<bool> UpdateFood(Food food);

		public Task<bool> DeleteFood(Food food);

		public Task<List<Food>> SearchFoodsByName(string name);
	}
}
