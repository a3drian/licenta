
using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using FoodSpyAPI.Interfaces;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.DTOs.Models
{
	public class MealModel : IMeal
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		[BsonElement(nameof(Type))] public string Type { get; set; }

		[BsonElement(nameof(CreatedAt))] public DateTime CreatedAt { get; set; }

		[BsonElement(nameof(MealFoods))] public List<MealFood> MealFoods { get; set; }

		[BsonElement(nameof(Foods))] public List<Food> Foods { get; set; }
	}
}
