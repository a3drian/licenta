
namespace FoodSpyAPI.Interfaces
{
	public interface IFood
	{
		string Name { get; set; }

		double Energy { get; set; }

		double Fats { get; set; }

		double Saturates { get; set; }

		double Carbohydrates { get; set; }

		double Sugars { get; set; }

		double Proteins { get; set; }

		double Salt { get; set; }
	}
}
