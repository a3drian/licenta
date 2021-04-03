
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
	public class FoodsController : ControllerBase
	{
		private readonly FoodService _mealService;
		private readonly IMapper _mapper;
		private readonly LinkGenerator _linkGenerator;
		private readonly ILogger<FoodService> _logger;

		public FoodsController(FoodService mealService, IMapper mapper, LinkGenerator linkGenerator,
			 ILogger<FoodService> logger)
		{
			_mealService = mealService;
			_mapper = mapper;
			_linkGenerator = linkGenerator;
			_logger = logger;
		}

		[HttpGet]
		public async Task<ActionResult<List<FoodModel>>> GetFoods()
		{
			try {

				List<Food> meals = await _mealService.GetFoods();
				List<FoodModel> mappedFoods = _mapper.Map<List<FoodModel>>(meals);
				return mappedFoods;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<FoodModel>> GetFoodById(string id)
		{
			try {

				if (!Validator.IsValidId(id)) {
					return BadRequest($"'id' parameter: '{id}' is invalid!");
				}

				if (!Validator.IsValid24DigitHexString(id)) {
					return BadRequest($"'id' parameter: '{id}' is not a valid 24 digit hex string!");
				}

				Food meal = await _mealService.GetFoodById(id);

				if (meal == null) {
					return NotFound($"Food with id '{id}' was not found!");
				}

				FoodModel mappedFood = _mapper.Map<FoodModel>(meal);
				return mappedFood;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpPost]
		public async Task<ActionResult<FoodModel>> AddFood(Food meal)
		{
			try {

				Food addedFood = await _mealService.AddFood(meal);

				string location = _linkGenerator.GetPathByAction(
					 "GetFoodById",
					 "Foods",
					 new { id = addedFood.Id }
				);

				_logger.LogInformation($"location: {location}");

				if (string.IsNullOrWhiteSpace(location)) {
					return BadRequest($"Id '{meal.Id}' is invalid and cannot be used to create a new Food!");
				}

				FoodModel mappedFood = _mapper.Map<FoodModel>(addedFood);
				return Created(location, mappedFood);

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<FoodModel>> UpdateFood(string id, Food meal)
		{
			try {

				if (!Validator.IsValidId(id)) {
					return BadRequest($"'id' parameter: '{id}' is invalid!");
				}

				Food oldFood = await _mealService.GetFoodById(id);
				if (oldFood == null) {
					return NotFound($"Food with id '{id}' was not found!");
				}

				Food updatedFood = new Food(meal)
				{
					Id = oldFood.Id
				};

				bool updated = await _mealService.UpdateFood(updatedFood);
				if (!updated) {
					return BadRequest("Invalid parameters for 'PUT' request!");
				}

				return _mapper.Map<FoodModel>(updatedFood);

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteFood(string id)
		{
			try {

				if (!Validator.IsValidId(id)) {
					return BadRequest($"'id' parameter: '{id}' is invalid!");
				}

				Food meal = await _mealService.GetFoodById(id);
				if (meal == null) {
					return NotFound($"Food with id '{id}' was not found!");
				}

				bool deleted = await _mealService.DeleteFood(meal);
				if (!deleted) {
					return BadRequest("Invalid parameters for 'DELETE' request!");
				}

				return Ok($"Successfully deleted meal with id '{id}' ...");

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpGet("search")]
		public async Task<ActionResult<List<FoodModel>>> SearchFoodsByName(string name)
		{
			try {

				if (!Validator.IsEmptySearchTerm(name)) {
					return await GetFoods();
				}

				List<Food> searchResults = await _mealService.SearchFoodsByName(name);
				List<FoodModel> mappedFoods = _mapper.Map<List<FoodModel>>(searchResults);
				return mappedFoods;

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
