
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using FoodSpyAPI.Interfaces;

namespace FoodSpyAPI.Models
{
	public class FoodModel : IFood
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		[BsonElement("name")]
		public string Name { get; set; }

		[BsonElement("quantity")]
		public int Quantity { get; set; }

		[BsonElement("unit")]
		public string Unit { get; set; }

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
