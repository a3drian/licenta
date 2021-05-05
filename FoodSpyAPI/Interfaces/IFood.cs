
namespace FoodSpyAPI.Interfaces
{
	public interface IFood
	{
		string Name { get; set; }

		float Energy { get; set; }

		float Fats { get; set; }

		float Saturates { get; set; }

		float Carbohydrates { get; set; }

		float Sugars { get; set; }

		float Proteins { get; set; }

		float Salt { get; set; }
	}
}
