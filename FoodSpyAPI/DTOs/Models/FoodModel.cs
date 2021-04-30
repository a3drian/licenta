
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using FoodSpyAPI.Interfaces;

namespace FoodSpyAPI.DTOs.Models
{
	public class FoodModel : IFood
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		[BsonElement("name")] public string Name { get; set; }

		[BsonElement("quantity")] public int Quantity { get; set; }

		[BsonElement("unit")] public string Unit { get; set; }
	}
}
