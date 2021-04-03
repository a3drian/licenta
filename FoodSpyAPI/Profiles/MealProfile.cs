
using AutoMapper;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Profiles
{
	public class MealProfile : Profile
	{
		public MealProfile()
		{
			this.CreateMap<Meal, MealModel>();
		}
	}
}
