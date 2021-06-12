
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using MongoDB.Bson;
using Moq;
using NUnit.Framework;
using FoodSpyAPI.Controllers;
using FoodSpyAPI.DTOs.Models;
using FoodSpyAPI.Interfaces.Services;
using FoodSpyAPI.Models;

namespace FoodSpyAPIUnitTests.Intakes
{
	class IntakesController_UnitTests
	{
		private IntakesController _intakesController;

		private Mock<IIntakeService> _intakeService;
		private Mock<IMapper> _mapper;
		private Mock<ILogger<IIntakeService>> _logger;
		private Mock<LinkGenerator> _linkGenerator;

		[SetUp]
		public void Setup()
		{
			_intakeService = new Mock<IIntakeService>();
			_mapper = new Mock<IMapper>();
			_logger = new Mock<ILogger<IIntakeService>>();
			_linkGenerator = new Mock<LinkGenerator>();

			_intakesController = new IntakesController(
					 _intakeService.Object,
					 _mapper.Object,
					 _linkGenerator.Object,
					 _logger.Object
				 );
		}

		[TearDown]
		public void Teardown()
		{
			_intakeService = null;
			_mapper = null;
			_logger = null;
			_linkGenerator = null;
			_intakesController = null;
		}

		#region Constructor tests

		[Test]
		public void Constructor_IntakeServiceNull_Test()
		{
			ArgumentNullException ex =
				 Assert.Throws<ArgumentNullException>(
					  () => _intakesController = new IntakesController(
																 null,
																 _mapper.Object,
																 _linkGenerator.Object,
																 _logger.Object
															)
					  );

			Assert.AreEqual(ex.ParamName, "intakeService");
		}

		[Test]
		public void Constructor_MapperNull_Test()
		{
			ArgumentNullException ex =
				 Assert.Throws<ArgumentNullException>(
					  () => _intakesController = new IntakesController(
																 _intakeService.Object,
																 null,
																 _linkGenerator.Object,
																 _logger.Object
															)
					  );

			Assert.AreEqual(ex.ParamName, "mapper");
		}

		[Test]
		public void Constructor_LinkGeneratorNull_Test()
		{
			ArgumentNullException ex =
				 Assert.Throws<ArgumentNullException>(
					  () => _intakesController = new IntakesController(
																 _intakeService.Object,
																 _mapper.Object,
																 null,
																 _logger.Object
															)
					  );

			Assert.AreEqual(ex.ParamName, "linkGenerator");
		}

		[Test]
		public void Constructor_LoggerNull_Test()
		{
			ArgumentNullException ex =
				 Assert.Throws<ArgumentNullException>(
					  () => _intakesController = new IntakesController(
																 _intakeService.Object,
																 _mapper.Object,
																 _linkGenerator.Object,
																 null
															)
					  );

			Assert.AreEqual(ex.ParamName, "logger");
		}

		#endregion

		#region GET/:id tests

		[Test]
		[TestCaseSource(typeof(TestCaseFactory), nameof(TestCaseFactory.InvalidIDs))]
		public async Task GetIntakeById_ShouldReturnBadRequest_Test(string id)
		{
			// Act
			var result = await _intakesController.GetIntakeWithCalculatedCaloriesById(id);

			// Assert
			Assert.That(result.Result, Is.TypeOf(typeof(BadRequestObjectResult)));
		}

		[Test]
		[TestCaseSource(typeof(TestCaseFactory), nameof(TestCaseFactory.ValidIDs))]
		public async Task GetIntakeById_ShouldFindIntake_Test(string id)
		{
			// Arrange
			string intakeExistingId = id;

			Intake intake = TestCaseFactory.GetTestIntakeWithId(id);

			IntakeModel intakeModel = TestCaseFactory.GetTestIntakeModelWithId(id);

			_intakeService.Setup((item) => item
				.GetIntakeById(It.IsAny<string>()))
				.ReturnsAsync(intake);

			_mapper.Setup((item) => item
				.Map<IntakeModel>(It.IsAny<Intake>()))
				.Returns(intakeModel);

			// Act
			var result = await _intakesController.GetIntakeWithCalculatedCaloriesById(intakeExistingId);

			// Assert
			Assert.That(result.Value, Is.TypeOf(typeof(IntakeModel)));
			Assert.AreEqual(intakeModel, result.Value);
			_intakeService.Verify(item => item.GetIntakeById(It.IsAny<string>()), Times.Exactly(1));
		}

		#endregion

		#region POST tests

		#endregion

	}
}