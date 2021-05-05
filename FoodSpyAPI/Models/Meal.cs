
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using FoodSpyAPI.Helpers;
using FoodSpyAPI.Interfaces;

namespace FoodSpyAPI.Models
{
	public class Meal : IMeal
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		[BsonElement(nameof(Type))]
		[Required]
		public string Type { get; set; }

		[BsonElement(nameof(CreatedAt))]
		[Required]
		public DateTime CreatedAt { get; set; }

		[BsonElement(nameof(MealFoods))]
		[Required]
		public List<MealFood> MealFoods { get; set; }

		[BsonElement(nameof(Foods))]
		public List<Food> Foods { get; set; }

		public Meal() { }
		public Meal(Meal meal)
		{
			this.Type = meal.Type;
			this.CreatedAt = meal.CreatedAt;
			this.MealFoods = meal.MealFoods;
			this.Foods = new List<Food>();
		}

		public override string ToString()
		{
			string blank = "";
			char space = ' ';

			string output = $"{blank.PadLeft(5, space)} {nameof(Meal)}: " + "{ " + "\n";
			output += $"{blank.PadLeft(10, space)}";

			output += $" {nameof(Id)}: {Id}" + ",";
			output += $" {nameof(Type)}: {Type}" + ",";
			output += $" {nameof(CreatedAt)}: {CreatedAt.Print()}" + "\n";

			output += $"{blank.PadLeft(10, space)} {nameof(MealFood)}s:" + "\n";
			foreach (MealFood mf in MealFoods) {
				output += $"{blank.PadLeft(15, space)} {mf}" + "\n";
			}

			output += $"{blank.PadLeft(5, space)}" + " } :" + nameof(Meal) + "\n";

			return output;
		}
	}
}
