
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using FoodSpyAPI.Common;
using FoodSpyAPI.DTOs;
using FoodSpyAPI.Helpers;
using FoodSpyAPI.Models;
using FoodSpyAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;

namespace FoodSpyAPI.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class IntakesController : ControllerBase
	{
		#region Constants

		private const string OK_RESULT = "OK";

		#endregion

		private readonly IntakeService _intakeService;
		private readonly IMapper _mapper;
		private readonly LinkGenerator _linkGenerator;
		private readonly ILogger<IntakeService> _logger;

		public IntakesController(IntakeService intakeService, IMapper mapper, LinkGenerator linkGenerator,
			 ILogger<IntakeService> logger)
		{
			_intakeService = intakeService;
			_mapper = mapper;
			_linkGenerator = linkGenerator;
			_logger = logger;
		}

		#region GET

		[HttpGet]
		public async Task<ActionResult<List<IntakeModel>>> GetIntakes()
		{
			try {

				List<Intake> intakes = await _intakeService.GetIntakes();

				List<IntakeModel> mappedIntakes = _mapper.Map<List<IntakeModel>>(intakes);
				return mappedIntakes;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		#endregion

		#region GET/:id

		[HttpGet("{id}")]
		public async Task<ActionResult<IntakeModel>> GetIntakeById(string id)
		{
			try {

				ObjectResult validationResult = ValidateID(id);
				if (!validationResult.Value.Equals(OK_RESULT)) {
					return validationResult;
				}

				Intake intake = await _intakeService.GetIntakeById(id);

				if (intake == null) {
					return NotFound($"Intake with id '{id}' was not found!");
				}

				IntakeModel mappedIntake = _mapper.Map<IntakeModel>(intake);
				return mappedIntake;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		#endregion

		#region POST

		[HttpPost]
		public async Task<ActionResult<IntakeModel>> AddIntake(IntakeModel intake)
		{
			try {

				ObjectResult validationResult = ValidateIntake(intake);
				if (!validationResult.Value.Equals(OK_RESULT)) {
					return validationResult;
				}

				Intake mapFromModel = _mapper.Map<IntakeModel, Intake>(intake);
				Intake addedIntake = await _intakeService.AddIntake(mapFromModel);

				string location = _linkGenerator.GetPathByAction(
					 "GetIntakeById",
					 "Intakes",
					 new { id = addedIntake.Id }
				);

				_logger.LogInformation($"location: {location}");

				if (string.IsNullOrWhiteSpace(location)) {
					return BadRequest($"Id '{intake.Id}' is invalid and cannot be used to create a new Intake!");
				}

				IntakeModel mapToModel = _mapper.Map<IntakeModel>(addedIntake);
				return Created(location, mapToModel);

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		#endregion

		#region PUT

		[HttpPut("{id}")]
		public async Task<ActionResult<IntakeModel>> UpdateIntake(string id, IntakeModel intake)
		{
			try {

				ObjectResult validationIDResult = ValidateID(id);
				if (!validationIDResult.Value.Equals(OK_RESULT)) {
					return validationIDResult;
				}

				ObjectResult validationResult = ValidateIntake(intake);
				if (!validationResult.Value.Equals(OK_RESULT)) {
					return validationResult;
				}

				Intake oldIntake = await _intakeService.GetIntakeById(id);
				if (oldIntake == null) {
					return NotFound($"Intake with id '{id}' was not found!");
				}

				Intake mapFromModel = _mapper.Map<IntakeModel, Intake>(intake);
				Intake updatedIntake = new Intake(mapFromModel)
				{
					Id = oldIntake.Id
				};

				bool updated = await _intakeService.UpdateIntake(updatedIntake);
				if (!updated) {
					return BadRequest("Invalid parameters for 'PUT' request!");
				}

				IntakeModel mapToModel = _mapper.Map<IntakeModel>(updatedIntake);
				return mapToModel;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		#endregion

		#region DELETE

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteIntake(string id)
		{
			try {

				ObjectResult validationResult = ValidateID(id);
				if (!validationResult.Value.Equals(OK_RESULT)) {
					return validationResult;
				}

				Intake intake = await _intakeService.GetIntakeById(id);
				if (intake == null) {
					return NotFound($"Intake with id '{id}' was not found!");
				}

				bool deleted = await _intakeService.DeleteIntake(intake);
				if (!deleted) {
					return BadRequest("Invalid parameters for 'DELETE' request!");
				}

				return Ok($"Successfully deleted intake with id '{id}' ...");

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		#endregion

		#region Search methods

		[HttpPost("search")]
		public async Task<ActionResult<List<IntakeModel>>> SearchIntakesByEmail([FromBody] SearchByEmailOptions searchQuery)
		{
			try {

				if (!Validator.IsValidSearchByEmailQuery(searchQuery)) {
					return BadRequest($"'{nameof(searchQuery)}' should contain valid e-mail and sort order!");
				}

				string email = searchQuery.Email;
				SortOrder sortOrder = searchQuery.SortOrder;

				List<Intake> searchResults = await _intakeService.SearchIntakesByEmail(email, sortOrder);

				List<IntakeModel> mappedIntakes = _mapper.Map<List<IntakeModel>>(searchResults);
				return mappedIntakes;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpPost("searchByEmailAndCreatedAt")]
		public async Task<ActionResult<IntakeModel>> SearchIntakesByEmailAndDate([FromBody] SearchByEmailAndDateOptions searchQuery)
		{
			try {

				if (!Validator.IsValidSearchByEmailAndDateQuery(searchQuery)) {
					return BadRequest($"'{nameof(searchQuery)}' should contain valid e-mail and createdAt!");
				}

				string email = searchQuery.Email;
				DateTime createdAt = searchQuery.CreatedAt;

				Intake intake = await _intakeService.SearchIntakeByEmailAndDate(email, createdAt);

				if (intake == null) {
					return NoContent();
				}

				IntakeModel mappedExistingIntake = _mapper.Map<IntakeModel>(intake);
				return mappedExistingIntake;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		#endregion

		#region Private methods

		private ObjectResult ValidateID(string id)
		{
			ObjectResult result = new ObjectResult(OK_RESULT);

			if (!Validator.IsValidId(id)) {
				return BadRequest($"'{nameof(id)}' parameter: '{id}' is invalid!");
			}
			if (!Validator.IsValid24DigitHexString(id)) {
				return BadRequest($"'{nameof(id)}' parameter: '{id}' is not a valid 24 digit hex string!");
			}

			return result;
		}

		private ObjectResult ValidateIntake(IntakeModel intake)
		{
			ObjectResult result = new ObjectResult(OK_RESULT);
			if (!Validator.IsValidEmail(intake.Email)) {
				return BadRequest($"'{nameof(intake.Email)}' is missing or is invalid!");
			}
			if (!Validator.IsValidDate(intake.CreatedAt)) {
				return BadRequest($"'{nameof(intake.CreatedAt)}' is missing or is invalid!");
			}
			if (!Validator.IsValidIDArray(intake.MealIDs)) {
				return BadRequest($"'{nameof(intake.MealIDs)}' is missing or is invalid!");
			}

			List<string> mealIDs = intake.MealIDs;
			foreach (string mealID in mealIDs) {
				if (!Validator.IsValidId(mealID)) {
					return BadRequest($"'{nameof(mealID)}' parameter: '{mealID}' is invalid!");
				}
				if (!Validator.IsValid24DigitHexString(mealID)) {
					return BadRequest($"'{nameof(mealID)}' parameter: '{mealID}' is not a valid 24 digit hex string!");
				}
			}

			return result;
		}

		private ObjectResult LogDatabaseException(Exception e)
		{
			_logger.LogError(e.ToString());
			return this.StatusCode(
				 StatusCodes.Status500InternalServerError,
				 "Database failure!");
		}

		#endregion
	}
}
