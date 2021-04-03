
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using FoodSpyAPI.Models;
using FoodSpyAPI.Settings;

namespace FoodSpyAPI.Services
{
	public class MealService
	{
		private readonly IMongoCollection<Meal> _meals;
		private readonly ILogger<MealService> _logger;

		public MealService(IMealsDatabaseSettings settings, ILogger<MealService> logger)
		{
			MongoClient client = new MongoClient(settings.ConnectionString);
			IMongoDatabase database = client.GetDatabase(settings.DatabaseName);

			_meals = database.GetCollection<Meal>(settings.MealsCollectionName);

			_logger = logger;
		}

		// GET
		public async Task<List<Meal>> GetMeals()
		{
			_logger.LogInformation($"Fetching meals...");

			IAsyncCursor<Meal> meals = await _meals.FindAsync<Meal>(meal => true);
			List<Meal> mealsList = meals.ToList();
			return mealsList;
		}

		// GET/:id
		public async Task<Meal> GetMealById(string id)
		{
			_logger.LogInformation($"Fetching meal with id '{id}' ...");

			IAsyncCursor<Meal> findResult = await _meals.FindAsync<Meal>(n => n.Id == id);
			Task<Meal> mealSingleOrDefault = findResult.SingleOrDefaultAsync();
			Meal meal = mealSingleOrDefault.Result;
			return meal;
		}

		/// <summary>
		/// Executes the "POST" request on the database.
		/// </summary>
		/// <param name="meal">The meal object to be added to the database.</param>
		/// <returns>
		///   <c>true</c> if meal was updated successfully; otherwise, <c>false</c>.
		/// </returns>
		public async Task<Meal> AddMeal(Meal meal)
		{
			_logger.LogInformation($"Adding new meal...\n{meal}");

			await _meals.InsertOneAsync(meal);
			return meal;
		}

		/// <summary>
		/// Executes the "UPDATE" request on the database.
		/// </summary>
		/// <param name="meal">The meal object to be deleted.</param>
		/// <returns>
		///   <c>true</c> if meal was updated successfully; otherwise, <c>false</c>.
		/// </returns>
		public async Task<bool> UpdateMeal(Meal meal)
		{
			_logger.LogInformation($"Updating meal with id '{meal.Id}' ...");

			ReplaceOneResult result = await _meals
				 .ReplaceOneAsync<Meal>(
					  filter: n => n.Id == meal.Id,
					  replacement: meal
				 );

			bool updated = result.IsAcknowledged;
			// TO DO: used to be result.ToJson()
			_logger.LogInformation($"result.IsAcknowledged: {updated}");

			return updated;
		}

		/// <summary>
		/// Executes the "DELETE" request on the database.
		/// </summary>
		/// <param name="meal">The meal object to be deleted.</param>
		/// <returns>
		///   <c>true</c> if meal was deleted successfully; otherwise, <c>false</c>.
		/// </returns>
		public async Task<bool> DeleteMeal(Meal meal)
		{
			_logger.LogInformation($"Deleting meal with id '{meal.Id}' ...");

			DeleteResult result = await _meals.DeleteOneAsync(n => n.Id == meal.Id);

			bool deleted = result.IsAcknowledged;
			_logger.LogInformation($"{result.ToJson()}");

			return deleted;
		}

		public async Task<List<Meal>> SearchMealsByType(string type)
		{
			_logger.LogInformation($"Searching by type of '{type}' ...");

			IAsyncCursor<Meal> meals = await _meals
				 .FindAsync<Meal>(
					  filter: meal => meal.Type.Equals(type)
				 );
			List<Meal> mealsList = meals.ToList();

			_logger.LogInformation($"Meals of type: '{type}' ...");
			foreach (Meal meal in mealsList) {
				_logger.LogInformation($"Meal: {meal}\n");
			}

			return mealsList;
		}

		/*
		public async Task<List<Meal>> SearchMealsByName(string name)
		{
			 _logger.LogInformation($"Searching by name of '{name}' ...");

			 IAsyncCursor<Meal> meals = await _meals
				  .FindAsync<Meal>(
						filter: meal => meal.Name.Contains(name)
				  );
			 List<Meal> mealsList = meals.ToList();

			 return mealsList;
		}
		*/
	}
}
