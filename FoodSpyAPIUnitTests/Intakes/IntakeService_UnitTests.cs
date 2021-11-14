
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Moq;
using NUnit.Framework;
using FoodSpyAPI.Interfaces.Services;
using FoodSpyAPI.Models;
using FoodSpyAPI.Services;
using FoodSpyAPI.Settings;

namespace FoodSpyAPIUnitTests.Intakes
{
	class IntakeService_UnitTests
	{
		private IIntakeService _intakeService;

		private IIntakesDatabaseSettings _databaseSettings;
		private Mock<IMongoCollection<Intake>> _intakes;
		private Mock<ILogger<IIntakeService>> _logger;

		[SetUp]
		public void Setup()
		{
			IntakesDatabaseSettings intakesDatabaseSettings = new IntakesDatabaseSettings()
			{
				ConnectionString = "mongodb://test",
				DatabaseName = "test",
				IntakesCollectionName = "intakesTest"
			};

			_databaseSettings = intakesDatabaseSettings;
			_intakes = new Mock<IMongoCollection<Intake>>();
			_logger = new Mock<ILogger<IIntakeService>>();

			_intakeService = new IntakeService(
					_databaseSettings,
					null,
					_logger.Object
				);
		}

		[TearDown]
		public void Teardown()
		{
			_intakeService = null;
		}

		#region GET/:id tests

		[Test]
		[TestCaseSource(typeof(TestCaseFactory), nameof(TestCaseFactory.InvalidIDs))]
		public async Task GetIntakeById_ShouldReturnBadRequest_Test(string id)
		{
			// Act
			var result = await _intakeService.GetIntakeById(id);

			// Assert
			Assert.That(result, Is.TypeOf(typeof(BadRequestObjectResult)));
		}

		#endregion

	}
}
