
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using FoodSpyAPI.Interfaces;
using System;

namespace FoodSpyAPI.Models
{
	public class MealFood : IMealFood
	{
		[BsonElement(nameof(Mfid))]
		public Guid Mfid { get; set; }

		[BsonElement(nameof(Quantity))]
		public double Quantity { get; set; }

		[BsonElement(nameof(Unit))]
		public string Unit { get; set; }

		[BsonElement(nameof(Food))]
		public Food Food { get; set; }

		public MealFood() { }

		public MealFood(MealFood mealFood)
		{
			this.Mfid = mealFood.Mfid;
			this.Quantity = mealFood.Quantity;
			this.Unit = mealFood.Unit;
			this.Food = mealFood.Food;
		}

		public override string ToString()
		{
			string blank = "";
			char space = ' ';

			string output = $"{blank.PadLeft(5, space)} {nameof(MealFood)}: " + "{ " + "\n";
			output += $"{blank.PadLeft(10, space)}";

			output += $" {nameof(Mfid)}: {Mfid}" + ",";
			output += $" {nameof(Quantity)}: {Quantity}" + ",";
			output += $" {nameof(Food)}: {Food}" + ",";
			output += $" {nameof(Unit)}: {Unit}" + "\n";

			output += $"{blank.PadLeft(5, space)}" + " } :" + nameof(MealFood) + "\n";

			return output;
		}
	}
}
