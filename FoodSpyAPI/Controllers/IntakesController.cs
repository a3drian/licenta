﻿
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using AutoMapper;
using FoodSpyAPI.Common;
using FoodSpyAPI.DTOs;
using FoodSpyAPI.DTOs.Models;
using FoodSpyAPI.Helpers;
using FoodSpyAPI.Interfaces.Services;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Controllers
{
	[ApiController]
	[Route("api/db/[controller]")]
	public class IntakesController : ControllerBase
	{
		private readonly IIntakeService _intakeService;
		private readonly IMapper _mapper;
		private readonly LinkGenerator _linkGenerator;
		private readonly ILogger<IIntakeService> _logger;

		public IntakesController(IIntakeService intakeService, IMapper mapper, LinkGenerator linkGenerator, ILogger<IIntakeService> logger)
		{
			_intakeService = intakeService ?? throw new ArgumentNullException(nameof(intakeService));
			_mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
			_linkGenerator = linkGenerator ?? throw new ArgumentNullException(nameof(linkGenerator));
			_logger = logger ?? throw new ArgumentNullException(nameof(logger));
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

		/*
		[HttpGet("{id}")]
		public async Task<ActionResult<IntakeModel>> GetIntakeById(string id)
		{
			try {

				ObjectResult validateID = ValidateID(id);
				if (!validateID.Value.Equals(ControllerValidator.OK_RESULT)) {
					return validateID;
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
		*/

		//[HttpGet("calculate/{id}")]
		[HttpGet("{id}")]
		public async Task<ActionResult<IntakeModel>> GetIntakeWithCalculatedCaloriesById(string id)
		{
			try {

				ObjectResult validateID = ValidateID(id);
				if (!validateID.Value.Equals(ControllerValidator.OK_RESULT)) {
					return validateID;
				}

				Intake intake = await _intakeService.GetIntakeWithCalculatedCaloriesById(id);

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
				if (!validationResult.Value.Equals(ControllerValidator.OK_RESULT)) {
					return validationResult;
				}

				Intake mapFromModel = _mapper.Map<IntakeModel, Intake>(intake);
				Intake addedIntake = await _intakeService.AddIntake(mapFromModel);

				string location = _linkGenerator.GetPathByAction(
					 nameof(GetIntakeWithCalculatedCaloriesById),
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

				ObjectResult validateID = ValidateID(id);
				if (!validateID.Value.Equals(ControllerValidator.OK_RESULT)) {
					return validateID;
				}

				ObjectResult validateIntake = ValidateIntake(intake);
				if (!validateIntake.Value.Equals(ControllerValidator.OK_RESULT)) {
					return validateIntake;
				}

				Intake oldIntake = await _intakeService.GetUnpopulatedIntakeById(id);
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

				ObjectResult validateID = ValidateID(id);
				if (!validateID.Value.Equals(ControllerValidator.OK_RESULT)) {
					return validateID;
				}

				Intake intake = await _intakeService.GetUnpopulatedIntakeById(id);
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

		#region Validator methods

		private ObjectResult ValidateID(string id)
		{
			ObjectResult result = new ObjectResult(ControllerValidator.OK_RESULT);

			if (!Validator.IsValidAndNotEmptyString(id)) {
				return BadRequest($"'{nameof(id)}' parameter: '{id}' is invalid!");
			}
			if (!Validator.IsValidGuid(id)) {
				return BadRequest($"'{nameof(id)}' parameter: '{id}' is not a valid 24 digit hex string!");
			}

			return result;
		}

		private ObjectResult ValidateIntake(IntakeModel intake)
		{
			ObjectResult result = new ObjectResult(ControllerValidator.OK_RESULT);
			if (!Validator.IsValidEmail(intake.Email)) {
				return BadRequest($"'{nameof(intake.Email)}' is missing or is invalid!");
			}
			if (!Validator.IsValidDate(intake.CreatedAt)) {
				return BadRequest($"'{nameof(intake.CreatedAt)}' is missing or is invalid!");
			}
			if (!Validator.IsValidGuidArray(intake.MealIDs)) {
				return BadRequest($"'{nameof(intake.MealIDs)}' is missing, is invalid or contains duplicates!");
			}
			/*
			if (!Validator.IsValidIntakeCalories(intake.Calories)) {
				return BadRequest($"'{nameof(intake.Calories)}' is missing or is invalid!");
			}
			*/

			return result;
		}

		#endregion

		#region Private methods

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
