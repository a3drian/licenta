
using AutoMapper;
using FoodSpyAPI.DTOs.Models;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Profiles
{
	public class MealProfile : Profile
	{
		public MealProfile()
		{
			this.CreateMap<Meal, MealModel>();
			this.CreateMap<MealModel, Meal>();
		}
	}
}
