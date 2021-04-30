
using System;

namespace FoodSpyAPI.DTOs
{
	public class SearchByEmailAndDateOptions : SearchByEmailOptions
	{
		public DateTime CreatedAt { get; set; }
	}
}
