
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
		[BsonElement(nameof(Id))]
		public Guid Id { get; set; }

		[Required]
		[BsonElement(nameof(Type))]
		public string Type { get; set; }

		[Required]
		[BsonElement(nameof(CreatedAt))]
		public DateTime CreatedAt { get; set; }

		[Required]
		[BsonElement(nameof(MealFoods))]
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
