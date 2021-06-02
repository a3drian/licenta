
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using FoodSpyAPI.Common;
using FoodSpyAPI.Helpers;
using FoodSpyAPI.Interfaces;

namespace FoodSpyAPI.Models
{
	public class Intake : IIntake
	{
		[BsonId]
		[BsonElement(nameof(Id))]
		public Guid Id { get; set; }

		[Required]
		[BsonElement(nameof(Email))]
		public string Email { get; set; }

		[Required]
		[BsonElement(nameof(Calories))]
		public double Calories { get; set; }

		[Required]
		[BsonElement(nameof(TargetCalories))]
		public double TargetCalories { get; set; }

		[Required]
		[BsonElement(nameof(CreatedAt))]
		public DateTime CreatedAt { get; set; }

		[Required]
		[BsonElement(nameof(MealIDs))]
		public List<Guid> MealIDs { get; set; }

		[BsonElement(nameof(Meals))]
		public List<Meal> Meals { get; set; }

		public Intake() { }
		public Intake(Intake intake)
		{
			this.Email = intake.Email;
			this.Calories = intake.Calories;
			this.CreatedAt = intake.CreatedAt;
			this.MealIDs = intake.MealIDs;
			this.Meals = new List<Meal>();
		}

		public override string ToString()
		{
			string blank = "";
			char space = ' ';

			string output = $"{blank.PadLeft(5, space)} {nameof(Intake)}: " + "{ " + "\n";
			output += $"{blank.PadLeft(10, space)}";

			output += $" Id: {Id}" + ",";
			output += $" Email: {Email}" + ",";
			output += $" Calories: {Calories} / {TargetCalories}" + Units.CALORIES + ",";
			output += $" CreatedAt: {CreatedAt.Print()}" + "\n";

			output += $"{blank.PadLeft(10, space)} {nameof(MealIDs)}:" + "\n";
			foreach (Guid id in MealIDs) {
				output += $"{blank.PadLeft(15, space)} ID: {id} \n";
			}

			output += $"{blank.PadLeft(5, space)}" + " } :" + nameof(Intake) + "\n";

			return output;
		}
	}
}