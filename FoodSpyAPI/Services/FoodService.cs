
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using FoodSpyAPI.Interfaces.Services;
using FoodSpyAPI.Models;
using FoodSpyAPI.Settings;

namespace FoodSpyAPI.Services
{
	public class FoodService : IFoodService
	{
		private readonly IMongoCollection<Food> _foods;
		private readonly ILogger<IFoodService> _logger;

		public FoodService(IFoodsDatabaseSettings settings, ILogger<IFoodService> logger)
		{
			if (settings == null) {
				throw new ArgumentNullException(nameof(settings));
			}

			MongoClient client = new MongoClient(settings.ConnectionString);
			IMongoDatabase database = client.GetDatabase(settings.DatabaseName);

			_foods = database.GetCollection<Food>(settings.FoodsCollectionName);

			_logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		// GET
		public async Task<List<Food>> GetFoods()
		{
			_logger.LogInformation($"Fetching foods...");

			IAsyncCursor<Food> foods = await _foods.FindAsync<Food>(food => true);
			List<Food> foodsList = foods.ToList();
			return foodsList;
		}

		// GET/:id
		public async Task<Food> GetFoodById(string id)
		{
			_logger.LogInformation($"Fetching food with id '{id}' ...");

			Guid guid = new Guid(id);

			IAsyncCursor<Food> findResult = await _foods.FindAsync<Food>(f => f.Id.Equals(guid));
			Task<Food> foodSingleOrDefault = findResult.SingleOrDefaultAsync();
			Food food = foodSingleOrDefault.Result;
			return food;
		}

		/// <summary>
		/// Executes the "POST" request on the database.
		/// </summary>
		/// <param name="food">The food object to be added to the database.</param>
		/// <returns>
		///   <c>true</c> if food was updated successfully; otherwise, <c>false</c>.
		/// </returns>
		public async Task<Food> AddFood(Food food)
		{
			_logger.LogInformation($"Adding new food...\n{food}");

			await _foods.InsertOneAsync(food);
			return food;
		}

		/// <summary>
		/// Executes the "UPDATE" request on the database.
		/// </summary>
		/// <param name="food">The food object to be deleted.</param>
		/// <returns>
		///   <c>true</c> if food was updated successfully; otherwise, <c>false</c>.
		/// </returns>
		public async Task<bool> UpdateFood(Food food)
		{
			_logger.LogInformation($"Updating food with id '{food.Id}' ...");

			ReplaceOneResult result = await _foods
				 .ReplaceOneAsync<Food>(
					  filter: f => f.Id.Equals(food.Id),
					  replacement: food
				 );

			bool updated = result.IsAcknowledged;
			// TO DO: used to be result.ToJson()
			_logger.LogInformation($"result.IsAcknowledged: {updated}");

			return updated;
		}

		/// <summary>
		/// Executes the "DELETE" request on the database.
		/// </summary>
		/// <param name="food">The food object to be deleted.</param>
		/// <returns>
		///   <c>true</c> if food was deleted successfully; otherwise, <c>false</c>.
		/// </returns>
		public async Task<bool> DeleteFood(Food food)
		{
			_logger.LogInformation($"Deleting food with id '{food.Id}' ...");

			DeleteResult result = await _foods.DeleteOneAsync(f => f.Id.Equals(food.Id));

			bool deleted = result.IsAcknowledged;
			_logger.LogInformation($"{result.ToJson()}");

			return deleted;
		}

		#region Search methods

		public async Task<List<Food>> SearchFoodsByName(string name)
		{
			_logger.LogInformation($"Searching by name of '{name}' ...");

			string SEARCH_BY_NAME = nameof(Food.Name);

			FilterDefinition<Food> nameFilter = Builders<Food>
				.Filter
				.Regex(SEARCH_BY_NAME, new BsonRegularExpression(name, "i"));

			IAsyncCursor<Food> foods = await _foods
				 .FindAsync<Food>(
					  filter: nameFilter
				 );
			List<Food> foodsList = foods.ToList();

			return foodsList;
		}

		#endregion
	}
}
