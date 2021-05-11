
namespace FoodSpyAPI.Settings
{
	public interface IFoodsDatabaseSettings
	{
		string FoodsCollectionName { get; set; }
		string ConnectionString { get; set; }
		string DatabaseName { get; set; }
	}

	public class FoodsDatabaseSettings : IFoodsDatabaseSettings
	{
		public string FoodsCollectionName { get; set; }
		public string ConnectionString { get; set; }
		public string DatabaseName { get; set; }
	}
}
