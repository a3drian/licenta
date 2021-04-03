
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using FoodSpyAPI.Interfaces;

namespace FoodSpyAPI.Models
{
	public class Meal : IMeal
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		[BsonElement("email")]
		[Required]
		public string Email { get; set; }

		[BsonElement("type")]
		[Required]
		public string Type { get; set; }

		[BsonElement("foods")]
		[Required]
		public List<Food> Foods { get; set; }

		[BsonElement("createdAt")]
		[Required]
		public DateTime CreatedAt { get; set; }

		public Meal() { }
		public Meal(Meal meal)
		{
			this.Email = meal.Email;
			this.Type = meal.Type;
			this.Foods = meal.Foods;
			this.CreatedAt = meal.CreatedAt;
		}
		public override string ToString()
		{
			string output = "{" + "\n";

			output += $"\t Id: {Id} \n";
			output += $"\t Email: {Email} \n";
			output += $"\t Type: {Type} \n";
			output += $"\t Foods: \n";
			foreach (Food food in Foods) {
				output += $"\t Food: {food} \n";
			}
			output += $"\t CreatedAt: {CreatedAt} \n";

			output += "}" + "\n";

			return output;
		}
	}
}
