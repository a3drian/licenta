
using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using FoodSpyAPI.Interfaces;

namespace FoodSpyAPI.DTOs.Models
{
	public class MealModel : IMeal
	{
		[BsonId]
		[BsonElement(nameof(Id))]
		public Guid Id { get; set; }

		[BsonElement(nameof(Type))] public string Type { get; set; }

		[BsonElement(nameof(CreatedAt))] public DateTime CreatedAt { get; set; }

		[BsonElement(nameof(MealFoods))] public List<MealFoodModel> MealFoods { get; set; }

		// [BsonElement(nameof(Foods))] public List<Food> Foods { get; set; }
	}
}
