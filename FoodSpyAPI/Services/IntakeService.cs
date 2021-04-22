
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FoodSpyAPI.Common;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using FoodSpyAPI.Models;
using FoodSpyAPI.Settings;

namespace FoodSpyAPI.Services
{
	public class IntakeService
	{
		private readonly IMongoCollection<Intake> _intakes;
		private readonly ILogger<IntakeService> _logger;

		public IntakeService(IIntakesDatabaseSettings settings, ILogger<IntakeService> logger)
		{
			MongoClient client = new MongoClient(settings.ConnectionString);
			IMongoDatabase database = client.GetDatabase(settings.DatabaseName);

			_intakes = database.GetCollection<Intake>(settings.IntakesCollectionName);

			_logger = logger;
		}

		// GET
		public async Task<List<Intake>> GetIntakes()
		{
			_logger.LogInformation($"Fetching intakes...");

			IAsyncCursor<Intake> intakes = await _intakes.FindAsync<Intake>(intake => true);
			List<Intake> intakesList = intakes.ToList();
			return intakesList;
		}

		// GET/:id
		public async Task<Intake> GetIntakeById(string id)
		{
			_logger.LogInformation($"Fetching intake with id '{id}' ...");

			IAsyncCursor<Intake> findResult = await _intakes.FindAsync<Intake>(n => n.Id == id);
			Task<Intake> intakeSingleOrDefault = findResult.SingleOrDefaultAsync();
			Intake intake = intakeSingleOrDefault.Result;
			return intake;
		}

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

		public async Task<List<Intake>> SearchIntakesByEmail(string email, SortOrder sortOrder = SortOrder.Descending)
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
				_logger.LogInformation($"Intake: {intake}\n");
			}

			return intakesList;
		}

		public async Task<Intake> SearchIntakeByEmailAndDate(
			string email,
			DateTime createdAt,
			SortOrder sortOrder = SortOrder.Descending
		)
		{
			DateTime beginDate = createdAt.Date;
			DateTime endDate = beginDate.AddDays(1);

			string sortOrderName = Enum.GetName(typeof(SortOrder), sortOrder);
			_logger.LogInformation($"Searching by email of '{email}', created at '{createdAt}' and sort order '{sortOrderName}' ...");

			string SORT_BY_DATE = nameof(Intake.CreatedAt);
			SortDefinition<Intake> sortDefinition = sortOrder == SortOrder.Descending ?
				new SortDefinitionBuilder<Intake>().Descending(SORT_BY_DATE) :
				new SortDefinitionBuilder<Intake>().Ascending(SORT_BY_DATE);

			FindOptions<Intake> findOptions = new FindOptions<Intake>() { Sort = sortDefinition };

			IAsyncCursor<Intake> findResult = await _intakes
				.FindAsync<Intake>(
					filter: i => i.Email.Equals(email) && i.CreatedAt >= beginDate && i.CreatedAt <= endDate,
					findOptions
				);

			Task<Intake> intakeSingleOrDefault = findResult.SingleOrDefaultAsync();
			_logger.LogInformation($"Intake with email '{email}' and created at '{createdAt}'...");
			Intake intake = intakeSingleOrDefault.Result;
			return intake;
		}
	}
}
