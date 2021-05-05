
using MongoDB.Bson.Serialization.Attributes;
using FoodSpyAPI.Interfaces;

namespace FoodSpyAPI.DTOs.Models
{
	public class MealFoodModel : IMealFood
	{
		[BsonElement(nameof(Mfid))] public string Mfid { get; set; }

		[BsonElement(nameof(Quantity))] public double Quantity { get; set; }

		[BsonElement(nameof(Unit))] public string Unit { get; set; }
	}
}
