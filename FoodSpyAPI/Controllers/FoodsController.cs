
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using FoodSpyAPI.DTOs.Models;
using FoodSpyAPI.Helpers;
using FoodSpyAPI.Interfaces.Services;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Controllers
{
	[ApiController]
	[Route("api/db/[controller]")]
	public class FoodsController : ControllerBase
	{
		private readonly IFoodService _foodService;
		private readonly IMapper _mapper;
		private readonly LinkGenerator _linkGenerator;
		private readonly ILogger<IFoodService> _logger;

		public FoodsController(IFoodService foodService, IMapper mapper, LinkGenerator linkGenerator, ILogger<IFoodService> logger)
		{
			_foodService = foodService ?? throw new ArgumentNullException(nameof(foodService));
			_mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
			_linkGenerator = linkGenerator ?? throw new ArgumentNullException(nameof(linkGenerator));
			_logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		[HttpGet]
		public async Task<ActionResult<List<FoodModel>>> GetFoods()
		{
			try {

				List<Food> meals = await _foodService.GetFoods();
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

				if (!Validator.IsValidAndNotEmptyString(id)) {
					return BadRequest($"'id' parameter: '{id}' is invalid!");
				}

				if (!Validator.IsValidGuid(id)) {
					return BadRequest($"'id' parameter: '{id}' is not a valid 24 digit hex string!");
				}

				Food food = await _foodService.GetFoodById(id);

				if (food == null) {
					return NotFound($"Food with id '{id}' was not found!");
				}

				FoodModel mappedFood = _mapper.Map<FoodModel>(food);
				return mappedFood;

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpPost]
		public async Task<ActionResult<FoodModel>> AddFood(Food food)
		{
			try {

				string name = food.Name;
				if (!Validator.IsValidFoodName(name)) {
					return BadRequest($"Name '{food.Name}' is invalid or does not contain only allowed characters!");
				}

				string convertedName = CharacterConverter.ConvertDiacritics(name);
				food.Name = convertedName; // convert diacritics
				food.DisplayName = name;   // keep diacritics

				Food addedFood = await _foodService.AddFood(food);

				string location = _linkGenerator.GetPathByAction(
					 "GetFoodById",
					 "Foods",
					 new { id = addedFood.Id }
				);

				_logger.LogInformation($"location: {location}");

				if (string.IsNullOrWhiteSpace(location)) {
					return BadRequest($"Id '{food.Id}' is invalid and cannot be used to create a new Food!");
				}

				FoodModel mappedFood = _mapper.Map<FoodModel>(addedFood);
				return Created(location, mappedFood);

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<FoodModel>> UpdateFood(string id, Food food)
		{
			try {

				if (!Validator.IsValidAndNotEmptyString(id)) {
					return BadRequest($"'id' parameter: '{id}' is invalid!");
				}

				Food oldFood = await _foodService.GetFoodById(id);
				if (oldFood == null) {
					return NotFound($"Food with id '{id}' was not found!");
				}

				string name = food.Name;
				if (!Validator.IsValidFoodName(name)) {
					return BadRequest($"Name '{food.Name}' is invalid or does not contain only allowed characters!");
				}

				string convertedName = CharacterConverter.ConvertDiacritics(name);
				Food updatedFood = new Food(food)
				{
					Id = oldFood.Id,
					Name = convertedName,   // convert diacritics
					DisplayName = name      // keep diacritics
				};

				bool updated = await _foodService.UpdateFood(updatedFood);
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

				if (!Validator.IsValidAndNotEmptyString(id)) {
					return BadRequest($"'id' parameter: '{id}' is invalid!");
				}

				Food food = await _foodService.GetFoodById(id);
				if (food == null) {
					return NotFound($"Food with id '{id}' was not found!");
				}

				bool deleted = await _foodService.DeleteFood(food);
				if (!deleted) {
					return BadRequest("Invalid parameters for 'DELETE' request!");
				}

				return Ok($"Successfully deleted food with id '{id}' ...");

			} catch (Exception e) {
				return LogDatabaseException(e);
			}
		}

		[HttpGet("search")]
		public async Task<ActionResult<List<FoodModel>>> SearchFoodsByName(string name)
		{
			try {

				if (!Validator.IsValidFoodName(name)) {
					// TO DO: return BAD REQUEST
					return await GetFoods();
				}

				string convertedName = CharacterConverter.ConvertDiacritics(name);

				List<Food> searchResults = await _foodService.SearchFoodsByName(convertedName);
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
