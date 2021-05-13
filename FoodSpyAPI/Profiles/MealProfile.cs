
using AutoMapper;
using FoodSpyAPI.DTOs.Models;
using FoodSpyAPI.Models;
using MongoDB.Bson;

namespace FoodSpyAPI.Profiles
{
	public class MealProfile : Profile
	{
		public MealProfile()
		{
			this.CreateMap<ObjectId, string>().ConvertUsing(id => id.ToString());
			this.CreateMap<Meal, MealModel>();
			this.CreateMap<string, ObjectId>().ConvertUsing(id => new ObjectId(id));
			this.CreateMap<MealModel, Meal>();
		}
	}
}
