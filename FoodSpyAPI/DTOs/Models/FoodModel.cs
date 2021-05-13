
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

		[BsonElement(nameof(DisplayName))] public string DisplayName { get; set; }

		[BsonElement(nameof(Energy))] public double Energy { get; set; }

		[BsonElement(nameof(Fats))] public double Fats { get; set; }

		[BsonElement(nameof(Saturates))] public double Saturates { get; set; }

		[BsonElement(nameof(Carbohydrates))] public double Carbohydrates { get; set; }

		[BsonElement(nameof(Sugars))] public double Sugars { get; set; }

		[BsonElement(nameof(Proteins))] public double Proteins { get; set; }

		[BsonElement(nameof(Salt))] public double Salt { get; set; }
	}
}
