
namespace FoodSpyAPI.Settings
{
	public interface IMealsDatabaseSettings
	{
		string MealsCollectionName { get; set; }
		string ConnectionString { get; set; }
		string DatabaseName { get; set; }
	}

	public class MealsDatabaseSettings : IMealsDatabaseSettings
	{
		public string MealsCollectionName { get; set; }
		public string ConnectionString { get; set; }
		public string DatabaseName { get; set; }
	}
}
