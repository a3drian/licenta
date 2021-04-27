
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
			this.Type = meal.Type;
			this.Foods = meal.Foods;
			this.CreatedAt = meal.CreatedAt;
		}
		public override string ToString()
		{
			string output = "{";

			output += $" Id: {Id}" + ",";
			output += $" Type: {Type}" + ",";
			output += $" Foods:" + "\n";
			foreach (Food food in Foods) {
				output += $"\t\t\t Food: {food} \n";
			}
			output += $"\t\t CreatedAt: {CreatedAt}" + " ";

			output += "} :Meal" + "\n";

			return output;
		}
	}
}
