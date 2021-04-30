﻿
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

		[BsonElement("createdAt")]
		[Required]
		public DateTime CreatedAt { get; set; }

		[BsonElement("foodIDs")]
		[Required]
		public List<ObjectId> FoodIDs { get; set; }

		[BsonElement("foods")]
		public List<Food> Foods { get; set; }

		public Meal() { }
		public Meal(Meal meal)
		{
			this.Type = meal.Type;
			this.CreatedAt = meal.CreatedAt;
			this.FoodIDs = meal.FoodIDs;
			this.Foods = new List<Food>();
		}
		public override string ToString()
		{
			string blank = "";
			char space = ' ';

			string output = $"{blank.PadLeft(5, space)} Meal: " + "{ " + "\n";
			output += $"{blank.PadLeft(10, space)}";

			output += $" Id: {Id}" + ",";
			output += $" Type: {Type}" + ",";
			output += $" CreatedAt: {CreatedAt}" + "\n";

			output += $"{blank.PadLeft(10, space)} Food IDs:" + "\n";
			foreach (ObjectId id in FoodIDs) {
				output += $"{blank.PadLeft(15, space)} Food ID: {id} \n";
			}

			output += $"{blank.PadLeft(5, space)}" + " } :Meal" + "\n";

			return output;
		}
	}
}
