
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

		[BsonElement("type")] public string Type { get; set; }
		
		[BsonElement("createdAt")] public DateTime CreatedAt { get; set; }

		[BsonElement("foodIDs")] public List<string> FoodIDs { get; set; }

		[BsonElement("foods")] public List<Food> Foods { get; set; }
	}
}
