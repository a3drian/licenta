
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

		[BsonElement("name")]
		[Required]
		public string Name { get; set; }

		[BsonElement("quantity")]
		[Required]
		public int Quantity { get; set; }

		[BsonElement("unit")]
		[Required]
		public string Unit { get; set; }

		public Food() { }
		public Food(Food food)
		{
			this.Name = food.Name;
			this.Quantity = food.Quantity;
			this.Unit = food.Unit;
		}
		public override string ToString()
		{
			string output = "{" + "\n";

			output += $"\t Id: {Id} \n";
			output += $"\t Name: {Name} \n";
			output += $"\t Quantity: {Quantity} \n";
			output += $"\t Unit: {Unit} \n";

			output += "}" + "\n";

			return output;
		}
	}
}
