
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using FoodSpyAPI.Common;
using FoodSpyAPI.Interfaces;
using System;

namespace FoodSpyAPI.Models
{
	public class Food : IFood
	{
		[BsonId]
		[BsonElement(nameof(Id))]
		public Guid Id { get; set; }

		[Required]
		[BsonElement(nameof(Name))]
		public string Name { get; set; }

		[BsonElement(nameof(DisplayName))]
		public string DisplayName { get; set; }

		[Required]
		[BsonElement(nameof(Energy))]
		public double Energy { get; set; }

		[Required]
		[BsonElement(nameof(Fats))]
		public double Fats { get; set; }

		[Required]
		[BsonElement(nameof(Saturates))]
		public double Saturates { get; set; }

		[Required]
		[BsonElement(nameof(Carbohydrates))]
		public double Carbohydrates { get; set; }

		[Required]
		[BsonElement(nameof(Sugars))]
		public double Sugars { get; set; }

		[Required]
		[BsonElement(nameof(Proteins))]
		public double Proteins { get; set; }

		[Required]
		[BsonElement(nameof(Salt))]
		public double Salt { get; set; }

		public Food() { }
		public Food(Food food)
		{
			this.Name = food.Name;
			this.DisplayName = food.DisplayName;
			this.Energy = food.Energy;
			this.Fats = food.Fats;
			this.Saturates = food.Saturates;
			this.Carbohydrates = food.Carbohydrates;
			this.Sugars = food.Sugars;
			this.Proteins = food.Proteins;
			this.Salt = food.Salt;
		}

		public override string ToString()
		{
			string blank = "";
			char space = ' ';

			string output = $"{blank.PadLeft(5, space)} {nameof(Food)}: " + "{ " + "\n";
			output += $"{blank.PadLeft(10, space)}";

			output += $" {nameof(Id)}: {Id}" + ",";
			output += $" {nameof(Name)}: {Name}" + ",";
			output += $" {nameof(DisplayName)}: {DisplayName}" + "\n";

			output += $"{blank.PadLeft(10, space)}";

			output += $" {nameof(Energy)}: {Energy}" + Units.CALORIES + ",";
			output += $" {nameof(Fats)}: {Fats}" + Units.GRAMS + ",";
			output += $" {nameof(Saturates)}: {Saturates}" + Units.GRAMS + ",";
			output += $" {nameof(Carbohydrates)}: {Carbohydrates}" + Units.GRAMS + ",";
			output += $" {nameof(Sugars)}: {Sugars}" + Units.GRAMS + ",";
			output += $" {nameof(Proteins)}: {Proteins}" + Units.GRAMS + ",";
			output += $" {nameof(Salt)}: {Salt}" + Units.GRAMS + "\n";

			output += $"{blank.PadLeft(5, space)}" + " } :" + nameof(Food) + "\n";

			return output;
		}
	}
}
