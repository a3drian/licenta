
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
using FoodSpyAPI.Helpers;
using FoodSpyAPI.Interfaces.Services;
using FoodSpyAPI.Models;
using FoodSpyAPI.Settings;

namespace FoodSpyAPI.Services
{
	public class IntakeService : IIntakeService
	{
		#region Constants

		private const string MEALS_FOREIGN_COLLECTION_NAME = "Meals";
		private const string INTAKE_LOCAL_FIELD = nameof(Intake.MealIDs);
		private const string MEAL_FOREIGN_FIELD = "_id";
		private const string MEALS_ARRAY = nameof(Intake.Meals);

		#endregion

		private readonly IMongoCollection<Intake> _intakes;
		private readonly ILogger<IIntakeService> _logger;

		private readonly MealFoodService mealFoodService;

		public IntakeService(IIntakesDatabaseSettings settings, ILogger<IIntakeService> logger)
		{
			if (settings == null) {
				throw new ArgumentNullException(nameof(settings));
			}

			MongoClient client = new MongoClient(settings.ConnectionString);
			IMongoDatabase database = client.GetDatabase(settings.DatabaseName);

			_intakes = database.GetCollection<Intake>(settings.IntakesCollectionName);

			_logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		#region GET

		public async Task<List<Intake>> GetIntakes()
		{
			_logger.LogInformation($"Fetching intakes...");

			IAggregateFluent<Intake> aggregationMatch = _intakes
				.Aggregate()
				.Match<Intake>(intake => true);

			List<Intake> intakesList = await aggregationMatch
				.Lookup(
					MEALS_FOREIGN_COLLECTION_NAME,
					INTAKE_LOCAL_FIELD,
					MEAL_FOREIGN_FIELD,
					MEALS_ARRAY
				)
				.As<Intake>()
				.ToListAsync();

			return intakesList;
		}

		#endregion

		#region GET/:id

		public async Task<Intake> GetIntakeById(string id)
		{
			_logger.LogInformation($"Fetching intake with id '{id}' ...");

			IAggregateFluent<Intake> aggregationMatch = _intakes
				.Aggregate()
				.Match<Intake>(intake => intake.Id.ToString() == id);

			Intake intake = await aggregationMatch
				.Lookup(
					MEALS_FOREIGN_COLLECTION_NAME,
					INTAKE_LOCAL_FIELD,
					MEAL_FOREIGN_FIELD,
					MEALS_ARRAY
				)
				.As<Intake>()
				.SingleOrDefaultAsync();

			double calories = 0;
			List<Meal> meals = intake.Meals;
			foreach (Meal m in meals) {
				List<MealFood> mealFoods = m.MealFoods;
				double c = mealFoodService.CalculateCalories(mealFoods);
				calories += c;
			}

			intake.Calories = calories;

			_logger.LogInformation($"Intake with id '{id}' ...\n{intake}");

			return intake;
		}

		#endregion

		#region POST

		/// <summary>
		/// Executes the "POST" request on the database.
		/// </summary>
		/// <param name="intake">The intake object to be added to the database.</param>
		/// <returns>
		///   <c>true</c> if intake was updated successfully; otherwise, <c>false</c>.
		/// </returns>
		public async Task<Intake> AddIntake(Intake intake)
		{
			_logger.LogInformation($"Adding new intake...\n{intake}");

			await _intakes.InsertOneAsync(intake);
			return intake;
		}

		#endregion

		#region PUT

		/// <summary>
		/// Executes the "UPDATE" request on the database.
		/// </summary>
		/// <param name="intake">The intake object to be deleted.</param>
		/// <returns>
		///   <c>true</c> if intake was updated successfully; otherwise, <c>false</c>.
		/// </returns>
		public async Task<bool> UpdateIntake(Intake intake)
		{
			_logger.LogInformation($"Updating intake with id '{intake.Id}' ...");

			ReplaceOneResult result = await _intakes
				 .ReplaceOneAsync<Intake>(
					  filter: n => n.Id == intake.Id,
					  replacement: intake
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
		/// <param name="intake">The intake object to be deleted.</param>
		/// <returns>
		///   <c>true</c> if intake was deleted successfully; otherwise, <c>false</c>.
		/// </returns>
		public async Task<bool> DeleteIntake(Intake intake)
		{
			_logger.LogInformation($"Deleting intake with id '{intake.Id}' ...");

			DeleteResult result = await _intakes.DeleteOneAsync(n => n.Id == intake.Id);

			bool deleted = result.IsAcknowledged;
			_logger.LogInformation($"{result.ToJson()}");

			return deleted;
		}

		#endregion

		#region Search methods

		public async Task<List<Intake>> SearchIntakesByEmail(
			string email,
			SortOrder sortOrder = SortOrder.Descending)
		{
			string sortOrderName = Enum.GetName(typeof(SortOrder), sortOrder);
			_logger.LogInformation($"Searching by email of '{email}' and sort order '{sortOrderName}' ...");

			string SORT_BY_DATE = nameof(Intake.CreatedAt);
			SortDefinition<Intake> sortDefinition;
			if (sortOrder == SortOrder.Descending) {
				sortDefinition = new SortDefinitionBuilder<Intake>().Descending(SORT_BY_DATE);
			} else {
				sortDefinition = new SortDefinitionBuilder<Intake>().Ascending(SORT_BY_DATE);
			}

			FindOptions<Intake> findOptions = new FindOptions<Intake>() { Sort = sortDefinition };

			IAsyncCursor<Intake> intakes = await _intakes
				.FindAsync<Intake>(
					filter: intake => intake.Email.Equals(email),
					findOptions
				);
			List<Intake> intakesList = intakes.ToList();

			_logger.LogInformation($"Intakes with email: '{email}' ...");
			foreach (Intake intake in intakesList) {
				Console.WriteLine(intake);
			}

			return intakesList;
		}

		public async Task<Intake> SearchIntakeByEmailAndDate(
			string email,
			DateTime createdAt)
		{
			DateTime beginDate = createdAt.Date;
			DateTime endDate = beginDate.AddDays(1);

			_logger.LogInformation($"Searching by email of '{email}' and created at '{createdAt.Print()}' ...");

			Expression<Func<Intake, bool>> filter =
					i => i.Email.Equals(email) &&
					i.CreatedAt >= beginDate &&
					i.CreatedAt <= endDate;

			IAggregateFluent<Intake> aggregationMatch = _intakes
				.Aggregate()
				.Match<Intake>(filter);

			Intake intake = await aggregationMatch
				.Lookup(
					MEALS_FOREIGN_COLLECTION_NAME,
					INTAKE_LOCAL_FIELD,
					MEAL_FOREIGN_FIELD,
					MEALS_ARRAY
				)
				.As<Intake>()
				.SingleOrDefaultAsync();

			if (intake == null) {
				// If there is no intake on the given "createdAt" date
				_logger.LogInformation($"There are no intakes on date '{createdAt.Print()}' ...");
				return null;
			}

			List<Meal> meals = intake.Meals;
			List<Meal> orderedMeals = meals
				.OrderBy(meal => meal, new MealTypeComparer())
				.ToList();

			intake.Meals = orderedMeals;

			_logger.LogInformation($"Intake with email '{email}' and created at '{createdAt.Print()}' ...");
			Console.WriteLine(intake);

			return intake;
		}

		#endregion
	}
}
