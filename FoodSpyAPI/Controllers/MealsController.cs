
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FoodSpyAPI.Helpers;
using FoodSpyAPI.Models;
using FoodSpyAPI.Services;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;

namespace FoodSpyAPI.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class MealsController : ControllerBase
	{
		private readonly MealService _mealService;
		private readonly IMapper _mapper;
		private readonly LinkGenerator _linkGenerator;
		private readonly ILogger<MealService> _logger;

		public MealsController(MealService mealService, IMapper mapper, LinkGenerator linkGenerator,
			 ILogger<MealService> logger)
		{
			_mealService = mealService;
			_mapper = mapper;
			_linkGenerator = linkGenerator;
			_logger = logger;
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

		[HttpGet("{id}")]
		public async Task<ActionResult<MealModel>> GetMealById(string id)
		{
			try {

				if (!Validator.IsValidId(id)) {
					return BadRequest($"'id' parameter: '{id}' is invalid!");
				}

				if (!Validator.IsValid24DigitHexString(id)) {
					return BadRequest($"'id' parameter: '{id}' is not a valid 24 digit hex string!");
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

		[HttpPost]
		public async Task<ActionResult<MealModel>> AddMeal(Meal meal)
		{
			try {

				Meal addedMeal = await _mealService.AddMeal(meal);

				string location = _linkGenerator.GetPathByAction(
					 "GetMealById",
					 "Meals",
					 new { id = addedMeal.Id }
				);

				_logger.LogInformation($"location: {location}");

				if (string.IsNullOrWhiteSpace(location)) {
					return BadRequest($"Id '{meal.Id}' is invalid and cannot be used to create a new Meal!");
				}

				MealModel mappedMeal = _mapper.Map<MealModel>(addedMeal);
				return Created(location, mappedMeal);

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<MealModel>> UpdateMeal(string id, Meal meal)
		{
			try {

				if (!Validator.IsValidId(id)) {
					return BadRequest($"'id' parameter: '{id}' is invalid!");
				}

				Meal oldMeal = await _mealService.GetMealById(id);
				if (oldMeal == null) {
					return NotFound($"Meal with id '{id}' was not found!");
				}

				Meal updatedMeal = new Meal(meal)
				{
					Id = oldMeal.Id
				};

				bool updated = await _mealService.UpdateMeal(updatedMeal);
				if (!updated) {
					return BadRequest("Invalid parameters for 'PUT' request!");
				}

				return _mapper.Map<MealModel>(updatedMeal);

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteMeal(string id)
		{
			try {

				if (!Validator.IsValidId(id)) {
					return BadRequest($"'id' parameter: '{id}' is invalid!");
				}

				Meal meal = await _mealService.GetMealById(id);
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

		[HttpGet("type/{type}")]
		//[HttpGet("type")]
		public async Task<ActionResult<List<MealModel>>> SearchMealsByType(string type)
		{
			try {

				List<Meal> searchResults = await _mealService.SearchMealsByType(type);
				List<MealModel> mappedMeals = _mapper.Map<List<MealModel>>(searchResults);
				return mappedMeals;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		/*
		[HttpGet("search")]
		public async Task<ActionResult<List<MealModel>>> SearchMealsByName(string name)
		{
			 try
			 {

				  if (!Validator.IsEmptySearchTerm(name))
				  {
						return await GetMeals();
				  }

				  List<Meal> searchResults = await _mealService.SearchMealsByName(name);
				  List<MealModel> mappedMeals = _mapper.Map<List<MealModel>>(searchResults);
				  return mappedMeals;

			 }
			 catch (Exception e)
			 {
				  return LogDatabaseException(e);
			 }
		}
		*/

		private ObjectResult LogDatabaseException(Exception e)
		{
			_logger.LogError(e.ToString());
			return this.StatusCode(
				 StatusCodes.Status500InternalServerError,
				 "Database failure!");
		}
	}
}
