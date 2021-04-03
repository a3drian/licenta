
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

		[BsonElement("email")] public string Email { get; set; }

		[BsonElement("type")] public string Type { get; set; }

		[BsonElement("foods")] public List<Food> Foods { get; set; }

		[BsonElement("createdAt")] public DateTime CreatedAt { get; set; }

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
