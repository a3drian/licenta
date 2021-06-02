
using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using FoodSpyAPI.Interfaces;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.DTOs.Models
{
	public class IntakeModel : IIntake
	{
		[BsonId]
		[BsonElement(nameof(Id))]
		public Guid Id { get; set; }

		[BsonElement(nameof(Email))] public string Email { get; set; }

		[BsonElement(nameof(Calories))] public double Calories { get; set; }

		[BsonElement(nameof(TargetCalories))] public double TargetCalories { get; set; }

		[BsonElement(nameof(CreatedAt))] public DateTime CreatedAt { get; set; }

		[BsonElement(nameof(MealIDs))] public List<Guid> MealIDs { get; set; }

		[BsonElement(nameof(Meals))] public List<Meal> Meals { get; set; }
	}
}
