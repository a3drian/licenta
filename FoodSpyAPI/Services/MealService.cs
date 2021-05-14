
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using FoodSpyAPI.Common;
using FoodSpyAPI.Comparators;
using FoodSpyAPI.Interfaces.Services;
using FoodSpyAPI.Models;
using FoodSpyAPI.Settings;

namespace FoodSpyAPI.Services
{
	public class MealService : IMealService
	{
		#region Constants

		private const string FOODS_FOREIGN_COLLECTION_NAME = "Foods";
		private const string MEAL_LOCAL_FIELD = "MealFoods.Mfid";
		private const string FOOD_FOREIGN_FIELD = "_id";
		private const string FOODS_ARRAY = nameof(Meal.Foods);

		#endregion

		private readonly IMongoCollection<Meal> _meals;
		private readonly ILogger<IMealService> _logger;

		public MealService(IMealsDatabaseSettings settings, ILogger<IMealService> logger)
		{
			if (settings == null) {
				throw new ArgumentNullException(nameof(settings));
			}

			MongoClient client = new MongoClient(settings.ConnectionString);
			IMongoDatabase database = client.GetDatabase(settings.DatabaseName);

			_meals = database.GetCollection<Meal>(settings.MealsCollectionName);

			_logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		#region GET

		public async Task<List<Meal>> GetMeals()
		{
			_logger.LogInformation($"Fetching meals...");

			IAsyncCursor<Meal> meals = await _meals.FindAsync<Meal>(meal => true);
			List<Meal> mealsList = meals.ToList();
			return mealsList;
		}

		public async Task<List<Meal>> GetMealsWithFoods()
		{
			_logger.LogInformation($"Fetching meals...");

			IAggregateFluent<Meal> aggregationMatch = _meals
				.Aggregate()
				.Match<Meal>(meal => true);

			List<Meal> mealsList = await aggregationMatch
				.Lookup(
					FOODS_FOREIGN_COLLECTION_NAME,
					MEAL_LOCAL_FIELD,
					FOOD_FOREIGN_FIELD,
					FOODS_ARRAY
				)
				.As<Meal>()
				.ToListAsync();

			return mealsList;
		}

		#endregion

		#region GET/:id

		public async Task<Meal> GetMealById(string id)
		{
			_logger.LogInformation($"Fetching meal with id '{id}' ...");

			IAsyncCursor<Meal> findResult = await _meals.FindAsync<Meal>(n => n.Id == id);
			Task<Meal> mealSingleOrDefault = findResult.SingleOrDefaultAsync();
			Meal meal = mealSingleOrDefault.Result;

			_logger.LogInformation($"Meal with id '{id}' ...\n{meal}");

			return meal;
		}

		public async Task<Meal> GetMealByIdWithFoods(string id)
		{
			_logger.LogInformation($"Fetching meal with id '{id}' ...");

			IAggregateFluent<Meal> aggregationMatch = _meals
				.Aggregate()
				.Match<Meal>(meal => meal.Id == id);

			// sa vad daca pot popula "MealFoods.Food" de exemplu
			Meal meal = await aggregationMatch
				.Lookup(
					FOODS_FOREIGN_COLLECTION_NAME,
					MEAL_LOCAL_FIELD,
					FOOD_FOREIGN_FIELD,
					FOODS_ARRAY
				)
				.As<Meal>()
				.SingleOrDefaultAsync();

			List<MealFood> mealFoods = meal.MealFoods;

			for (int i = 0; i < meal.Foods.Count; i++) {
				mealFoods[i].Food = meal.Foods[i];
			}

			/*
			IAsyncCursor<Meal> findResult = await _meals.FindAsync<Meal>(n => n.Id == id);
			Task<Meal> mealSingleOrDefault = findResult.SingleOrDefaultAsync();
			Meal meal = mealSingleOrDefault.Result;
			*/

			_logger.LogInformation($"Meal with id '{id}' ...\n{meal}");

			return meal;
		}

		#endregion

		#region POST

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

		#endregion

		#region PUT

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

		#endregion

		#region DELETE

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

		#endregion

		#region Search methods

		public async Task<List<Meal>> SearchMealsByType(string type)
		{
			_logger.LogInformation($"Searching by type of '{type}' ...");

			IAsyncCursor<Meal> meals = await _meals
				 .FindAsync<Meal>(
					  filter: meal => meal.Type.Equals(type)
				 );

			if (meals == null) {
				_logger.LogInformation($"There are no meals matching type '{type}' ...");
				return null;
			}

			List<Meal> mealsList = meals.ToList();

			_logger.LogInformation($"Meals of type: '{type}' ...");
			foreach (Meal meal in mealsList) {
				Console.WriteLine(meal);
			}

			return mealsList;
		}

		#endregion
	}
}
