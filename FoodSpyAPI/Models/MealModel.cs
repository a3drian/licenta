
using System;
using System.Collections.Generic;
using FoodSpyAPI.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FoodSpyAPI.Models
{
	public class MealModel : IMeal
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		[BsonElement("type")] public string Type { get; set; }

		[BsonElement("foods")] public List<Food> Foods { get; set; }

		[BsonElement("createdAt")] public DateTime CreatedAt { get; set; }
	}
}
