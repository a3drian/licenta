
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

		[BsonElement("meals")] public List<Meal> Meals { get; set; }

		public override string ToString()
		{
			string output = "{" + "\n";

			output += $"\t Id: {Id} \n";
			output += $"\t Email: {Email} \n";
			output += $"\t CreatedAt: {CreatedAt} \n";
			output += $"\t Meals: \n";
			foreach (Meal meal in Meals) {
				output += $"\t Meal: {meal} \n";
			}

			output += "}" + "\n";

			return output;
		}
	}
}