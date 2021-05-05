
using AutoMapper;
using MongoDB.Bson;
using FoodSpyAPI.DTOs.Models;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Profiles
{
	public class MealFoodProfile : Profile
	{
		public MealFoodProfile()
		{
			this.CreateMap<ObjectId, string>().ConvertUsing(id => id.ToString());
			this.CreateMap<MealFood, MealFoodModel>();
			this.CreateMap<string, ObjectId>().ConvertUsing(id => new ObjectId(id));
			this.CreateMap<MealFoodModel, MealFood>();
		}
	}
}
