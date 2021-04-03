
using System.Collections.Generic;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Interfaces
{
	public interface IMeal
	{
		string Email { get; set; }
		string Type { get; set; }
		List<Food> Foods { get; set; }
	}
}
