
using System;
using System.Collections.Generic;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Interfaces
{
	public interface IIntake
	{
		string Email { get; set; }
		List<Meal> Meals { get; set; }
		DateTime CreatedAt { get; set; }
	}
}