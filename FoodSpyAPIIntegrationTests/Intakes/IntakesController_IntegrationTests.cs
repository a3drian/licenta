
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using AutoMapper;
using NUnit.Framework;
using FoodSpyAPI.Controllers;
using FoodSpyAPI.Interfaces.Services;
using FoodSpyAPI.Settings;
using Moq;

namespace FoodSpyAPIIntegrationTests.Intakes
{
	class IntakesController_IntegrationTests
	{
		private IntakesController _intakesController;

		private Mock<IIntakeService> _intakeService;
		private Mock<IMapper> _mapper;
		private Mock<ILogger<IIntakeService>> _logger;
		private Mock<LinkGenerator> _linkGenerator;
		private Mock<IIntakesDatabaseSettings> _intakesDatabaseSettings;
		private Mock<ILogger<IIntakeService>> _loggerIIntakeService;

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
	}
}
