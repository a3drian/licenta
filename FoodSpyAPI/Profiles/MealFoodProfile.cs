
using AutoMapper;
using FoodSpyAPI.DTOs.Models;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Profiles
{
	public class MealFoodProfile : Profile
	{
		public MealFoodProfile()
		{
			this.CreateMap<MealFood, MealFoodModel>();
			this.CreateMap<MealFoodModel, MealFood>();
		}
	}
}
