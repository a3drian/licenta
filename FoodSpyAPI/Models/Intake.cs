
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

		[BsonElement("meals")]
		[Required]
		public List<Meal> Meals { get; set; }

		public Intake() { }
		public Intake(Intake intake)
		{
			this.Email = intake.Email;
			this.Meals = intake.Meals;
			this.CreatedAt = intake.CreatedAt;
		}
		public override string ToString()
		{
			string output = "{" + " ";

			output += $" Id: {Id}" + ",";
			output += $" Email: {Email}" + ",";
			output += $" CreatedAt: {CreatedAt}" + ",";
			output += $" Meals:" + "\n";
			foreach (Meal meal in Meals) {
				output += $"\t\t Meal: {meal} \n";
			}

			output += "\t" + "} :Intake" + "\n";

			return output;
		}
	}
}