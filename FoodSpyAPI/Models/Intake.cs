
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using FoodSpyAPI.Interfaces;

namespace FoodSpyAPI.Models
{
	public class Intake : IIntake
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		[BsonElement("email")]
		[Required]
		public string Email { get; set; }

		[BsonElement("createdAt")]
		[Required]
		public DateTime CreatedAt { get; set; }

		[BsonElement("mealIDs")]
		[Required]
		public List<ObjectId> MealIDs { get; set; }

		[BsonElement("meals")]
		public List<Meal> Meals { get; set; }

		public Intake() { }
		public Intake(Intake intake)
		{
			this.Email = intake.Email;
			this.CreatedAt = intake.CreatedAt;
			this.MealIDs = intake.MealIDs;
			this.Meals = new List<Meal>();
		}
		public override string ToString()
		{
			string blank = "";
			char space = ' ';

			string output = $"{blank.PadLeft(5, space)} Intake: " + "{ " + "\n";
			output += $"{blank.PadLeft(10, space)}";

			output += $" Id: {Id}" + ",";
			output += $" Email: {Email}" + ",";
			output += $" CreatedAt: {CreatedAt}" + "\n";

			output += $"{blank.PadLeft(10, space)} Meal IDs:" + "\n";
			foreach (ObjectId id in MealIDs) {
				output += $"{blank.PadLeft(15, space)} Meal ID: {id} \n";
			}

			output += $"{blank.PadLeft(5, space)}" + " } :Intake" + "\n";

			return output;
		}
	}
}