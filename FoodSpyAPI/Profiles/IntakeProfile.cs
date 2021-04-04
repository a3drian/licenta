
using AutoMapper;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Profiles
{
	public class IntakeProfile : Profile
	{
		public IntakeProfile()
		{
			this.CreateMap<Intake, IntakeModel>();
		}
	}
}