
using System;
using System.Collections.Generic;
using FoodSpyAPI.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FoodSpyAPI.Models
{
	public class IntakeModel : IIntake
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		[BsonElement("email")] public string Email { get; set; }

		[BsonElement("createdAt")] public DateTime CreatedAt { get; set; }

		[BsonElement("mealIDs")] public List<string> MealIDs { get; set; }

		[BsonElement("meals")] public List<Meal> Meals { get; set; }
	}
}