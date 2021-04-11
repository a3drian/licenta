
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FoodSpyAPI.Helpers;
using AutoMapper;
using FoodSpyAPI.Common;
using FoodSpyAPI.DTOs;
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

		[HttpGet("{id}")]
		public async Task<ActionResult<IntakeModel>> GetIntakeById(string id)
		{
			try {

				if (!Validator.IsValidId(id)) {
					return BadRequest($"'id' parameter: '{id}' is invalid!");
				}

				if (!Validator.IsValid24DigitHexString(id)) {
					return BadRequest($"'id' parameter: '{id}' is not a valid 24 digit hex string!");
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

		[HttpPost]
		public async Task<ActionResult<IntakeModel>> AddIntake(Intake intake)
		{
			try {

				Intake addedIntake = await _intakeService.AddIntake(intake);

				string location = _linkGenerator.GetPathByAction(
					 "GetIntakeById",
					 "Intakes",
					 new { id = addedIntake.Id }
				);

				_logger.LogInformation($"location: {location}");

				if (string.IsNullOrWhiteSpace(location)) {
					return BadRequest($"Id '{intake.Id}' is invalid and cannot be used to create a new Intake!");
				}

				IntakeModel mappedIntake = _mapper.Map<IntakeModel>(addedIntake);
				return Created(location, mappedIntake);

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<IntakeModel>> UpdateIntake(string id, Intake intake)
		{
			try {

				if (!Validator.IsValidId(id)) {
					return BadRequest($"'id' parameter: '{id}' is invalid!");
				}

				Intake oldIntake = await _intakeService.GetIntakeById(id);
				if (oldIntake == null) {
					return NotFound($"Intake with id '{id}' was not found!");
				}

				Intake updatedIntake = new Intake(intake)
				{
					Id = oldIntake.Id
				};

				bool updated = await _intakeService.UpdateIntake(updatedIntake);
				if (!updated) {
					return BadRequest("Invalid parameters for 'PUT' request!");
				}

				return _mapper.Map<IntakeModel>(updatedIntake);

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteIntake(string id)
		{
			try {

				if (!Validator.IsValidId(id)) {
					return BadRequest($"'id' parameter: '{id}' is invalid!");
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

		[HttpPost("search")]
		public async Task<ActionResult<List<IntakeModel>>> SearchIntakesByEmail([FromBody] SearchByEmailOptions searchQuery)
		{
			try {

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

				string email = searchQuery.Email;
				DateTime createdAt = searchQuery.CreatedAt;
				SortOrder sortOrder = searchQuery.SortOrder;

				Intake intake = await _intakeService.SearchIntakeByEmailAndDate(email, createdAt, sortOrder);

				if (intake == null) {

					return NotFound($"Intake with e-mail '{email}' and created at '{createdAt}' was not found!");

					/*
					Task<ActionResult<IntakeModel>> newIntake = AddIntake(new Intake
					{
						CreatedAt = createdAt,
						Email = email,
						Meals = new List<Meal>()
					});
					IntakeModel mappedNewIntake = _mapper.Map<IntakeModel>(newIntake);
					return mappedNewIntake;
					*/
				}

				IntakeModel mappedExistingIntake = _mapper.Map<IntakeModel>(intake);
				return mappedExistingIntake;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		private ObjectResult LogDatabaseException(Exception e)
		{
			_logger.LogError(e.ToString());
			return this.StatusCode(
				 StatusCodes.Status500InternalServerError,
				 "Database failure!");
		}
	}
}
