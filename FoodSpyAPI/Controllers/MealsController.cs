
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using AutoMapper;
using FoodSpyAPI.DTOs.Models;
using FoodSpyAPI.Interfaces.Services;
using FoodSpyAPI.Helpers;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Controllers
{
	[ApiController]
	[Route("api/db/[controller]")]
	public class MealsController : ControllerBase
	{
		private readonly IMealService _mealService;
		private readonly IMapper _mapper;
		private readonly LinkGenerator _linkGenerator;
		private readonly ILogger<IMealService> _logger;

		public MealsController(IMealService mealService, IMapper mapper, LinkGenerator linkGenerator, ILogger<IMealService> logger)
		{
			_mealService = mealService ?? throw new ArgumentNullException(nameof(mealService));
			_mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
			_linkGenerator = linkGenerator ?? throw new ArgumentNullException(nameof(linkGenerator));
			_logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		#region GET

		[HttpGet("unpopulated")]
		public async Task<ActionResult<List<MealModel>>> GetUnpopulatedMeals()
		{
			try {

				List<Meal> meals = await _mealService.GetUnpopulatedMeals();
				List<MealModel> mappedMeals = _mapper.Map<List<MealModel>>(meals);
				return mappedMeals;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpGet]
		public async Task<ActionResult<List<MealModel>>> GetMeals()
		{
			try {

				List<Meal> meals = await _mealService.GetMeals();
				List<MealModel> mappedMeals = _mapper.Map<List<MealModel>>(meals);
				return mappedMeals;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		#endregion

		#region GET/:id

		[HttpGet("unpopulated/{id}")]
		public async Task<ActionResult<MealModel>> GetUnpopulatedMealById(string id)
		{
			try {

				ObjectResult validateID = ValidateID(id);
				if (!validateID.Value.Equals(ControllerValidator.OK_RESULT)) {
					return validateID;
				}

				Meal meal = await _mealService.GetUnpopulatedMealById(id);

				if (meal == null) {
					return NotFound($"Meal with id '{id}' was not found!");
				}

				MealModel mappedMeal = _mapper.Map<MealModel>(meal);
				return mappedMeal;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<MealModel>> GetMealById(string id)
		{
			try {

				ObjectResult validateID = ValidateID(id);
				if (!validateID.Value.Equals(ControllerValidator.OK_RESULT)) {
					return validateID;
				}

				Meal meal = await _mealService.GetMealById(id);

				if (meal == null) {
					return NotFound($"Meal with id '{id}' was not found!");
				}

				MealModel mappedMeal = _mapper.Map<MealModel>(meal);
				return mappedMeal;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		#endregion

		#region POST

		[HttpPost]
		public async Task<ActionResult<MealModel>> AddMeal(MealModel meal)
		{
			try {

				ObjectResult validateMeal = ValidateMeal(meal);
				if (!validateMeal.Value.Equals(ControllerValidator.OK_RESULT)) {
					return validateMeal;
				}

				Meal mapFromModel = _mapper.Map<MealModel, Meal>(meal);
				Meal addedMeal = await _mealService.AddMeal(mapFromModel);

				string location = _linkGenerator.GetPathByAction(
					 nameof(GetMealById),
					 "Meals",
					 new { id = addedMeal.Id }
				);

				_logger.LogInformation($"location: {location}");

				if (string.IsNullOrWhiteSpace(location)) {
					return BadRequest($"Id '{meal.Id}' is invalid and cannot be used to create a new Meal!");
				}

				MealModel mapToModel = _mapper.Map<MealModel>(addedMeal);
				return Created(location, mapToModel);

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		#endregion

		#region PUT

		[HttpPut("{id}")]
		public async Task<ActionResult<MealModel>> UpdateMeal(string id, MealModel meal)
		{
			try {

				ObjectResult validateID = ValidateID(id);
				if (!validateID.Value.Equals(ControllerValidator.OK_RESULT)) {
					return validateID;
				}

				ObjectResult validateMeal = ValidateMeal(meal);
				if (!validateMeal.Value.Equals(ControllerValidator.OK_RESULT)) {
					return validateMeal;
				}

				Meal oldMeal = await _mealService.GetUnpopulatedMealById(id);
				if (oldMeal == null) {
					return NotFound($"Meal with id '{id}' was not found!");
				}

				Meal mapFromModel = _mapper.Map<MealModel, Meal>(meal);
				Meal updatedMeal = new Meal(mapFromModel)
				{
					Id = oldMeal.Id
				};

				bool updated = await _mealService.UpdateMeal(updatedMeal);
				if (!updated) {
					return BadRequest("Invalid parameters for 'PUT' request!");
				}

				MealModel mapToModel = _mapper.Map<MealModel>(updatedMeal);
				return mapToModel;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		#endregion

		#region DELETE

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteMeal(string id)
		{
			try {

				ObjectResult validateID = ValidateID(id);
				if (!validateID.Value.Equals(ControllerValidator.OK_RESULT)) {
					return validateID;
				}

				Meal meal = await _mealService.GetUnpopulatedMealById(id);
				if (meal == null) {
					return NotFound($"Meal with id '{id}' was not found!");
				}

				bool deleted = await _mealService.DeleteMeal(meal);
				if (!deleted) {
					return BadRequest("Invalid parameters for 'DELETE' request!");
				}

				return Ok($"Successfully deleted meal with id '{id}' ...");

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		#endregion

		#region Search methods

		[HttpGet("type/{type}")]
		public async Task<ActionResult<List<MealModel>>> SearchMealsByType(string type)
		{
			try {

				if (!Validator.IsValidSearchTerm(type)) {
					return BadRequest($"'{nameof(type)}' should be a valid search term!");
				}

				if (!Validator.IsValidMealType(type)) {
					return BadRequest($"'{nameof(type)}' should be a valid meal type!");
				}

				string firstLetterUppercased = type.FirstLetterUppercased();
				List<Meal> searchResults = await _mealService.SearchMealsByType(firstLetterUppercased);
				List<MealModel> mappedMeals = _mapper.Map<List<MealModel>>(searchResults);
				return mappedMeals;

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
				return BadRequest($"'{nameof(id)}' parameter: '{id}' is not a valid Guid!");
			}

			return result;
		}

		private ObjectResult ValidateMeal(MealModel meal)
		{
			ObjectResult result = new ObjectResult(ControllerValidator.OK_RESULT);
			if (!Validator.IsValidMealType(meal.Type)) {
				return BadRequest($"'{nameof(meal.Type)}' is missing or is invalid!");
			}
			if (!Validator.IsValidDate(meal.CreatedAt)) {
				return BadRequest($"'{nameof(meal.CreatedAt)}' is missing or is invalid!");
			}

			List<MealFoodModel> mealFoods = meal.MealFoods;
			foreach (MealFoodModel mealFood in mealFoods) {
				string mfid = mealFood.Mfid;
				ObjectResult validateID = ValidateID(mfid);
				if (!validateID.Value.Equals(ControllerValidator.OK_RESULT)) {
					return validateID;
				}
				bool validQty = Validator.IsValidMealQuantity(mealFood.Quantity);
				if (!validQty) {
					return BadRequest($"'{nameof(mealFood.Quantity)}' is not a valid quantity!");
				}
				bool validFoodUnit = Validator.IsValidFoodUnit(mealFood.Unit);
				if (!validFoodUnit) {
					return BadRequest($"'{nameof(mealFood.Unit)}' is not a valid food unit!");
				}
			}

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
