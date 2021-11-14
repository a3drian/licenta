
using AutoMapper;
using FoodSpyAPI.DTOs.Models;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Profiles
{
	public class IntakeProfile : Profile
	{
		public IntakeProfile()
		{
			this.CreateMap<Intake, IntakeModel>();
			this.CreateMap<IntakeModel, Intake>();
		}
	}
}