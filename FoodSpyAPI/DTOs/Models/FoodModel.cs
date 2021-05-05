
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

		[BsonElement(nameof(Name))] public string Name { get; set; }

		[BsonElement(nameof(Energy))] public float Energy { get; set; }

		[BsonElement(nameof(Fats))] public float Fats { get; set; }

		[BsonElement(nameof(Saturates))] public float Saturates { get; set; }

		[BsonElement(nameof(Carbohydrates))] public float Carbohydrates { get; set; }

		[BsonElement(nameof(Sugars))] public float Sugars { get; set; }

		[BsonElement(nameof(Proteins))] public float Proteins { get; set; }

		[BsonElement(nameof(Salt))] public float Salt { get; set; }
	}
}
