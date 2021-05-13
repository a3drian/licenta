
using AutoMapper;
using MongoDB.Bson;
using FoodSpyAPI.DTOs.Models;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Profiles
{
	public class IntakeProfile : Profile
	{
		public IntakeProfile()
		{
			this.CreateMap<ObjectId, string>().ConvertUsing(id => id.ToString());
			this.CreateMap<Intake, IntakeModel>();
			this.CreateMap<string, ObjectId>().ConvertUsing(id => new ObjectId(id));
			this.CreateMap<IntakeModel, Intake>();
		}
	}
}