﻿
using AutoMapper;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Profiles
{
	public class FoodProfile : Profile
	{
		public FoodProfile()
		{
			this.CreateMap<Food, FoodModel>();
		}
	}
}
