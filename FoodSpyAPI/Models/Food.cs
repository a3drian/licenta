
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using FoodSpyAPI.Interfaces;

namespace FoodSpyAPI.Models
{
	public class Food : IFood
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		[BsonElement(nameof(Name))]
		[Required]
		public string Name { get; set; }

		[BsonElement(nameof(Energy))]
		public float Energy { get; set; }

		[BsonElement(nameof(Fats))]
		public float Fats { get; set; }

		[BsonElement(nameof(Saturates))]
		public float Saturates { get; set; }

		[BsonElement(nameof(Carbohydrates))]
		public float Carbohydrates { get; set; }

		[BsonElement(nameof(Sugars))]
		public float Sugars { get; set; }

		[BsonElement(nameof(Proteins))]
		public float Proteins { get; set; }

		[BsonElement(nameof(Salt))]
		public float Salt { get; set; }

		public Food() { }
		public Food(Food food)
		{
			this.Name = food.Name;
			this.Energy = food.Energy;
			this.Fats = food.Fats;
			this.Saturates = food.Saturates;
			this.Carbohydrates = food.Carbohydrates;
			this.Sugars = food.Sugars;
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
			output += $" {nameof(Energy)}: {Energy}" + "kcal,";
			output += $" {nameof(Fats)}: {Fats}" + "g,";
			output += $" {nameof(Saturates)}: {Saturates}" + "g,";
			output += $" {nameof(Carbohydrates)}: {Carbohydrates}" + "g,";
			output += $" {nameof(Sugars)}: {Sugars}" + "g,";
			output += $" {nameof(Salt)}: {Salt}" + "g" + "\n";

			output += $"{blank.PadLeft(5, space)}" + " } :" + nameof(Food) + "\n";

			return output;
		}
	}
}
