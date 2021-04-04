using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoodSpyAPI.Settings
{
	public interface IIntakesDatabaseSettings
	{
		string IntakesCollectionName { get; set; }
		string ConnectionString { get; set; }
		string DatabaseName { get; set; }
	}

	public class IntakesDatabaseSettings : IIntakesDatabaseSettings
	{
		public string IntakesCollectionName { get; set; }
		public string ConnectionString { get; set; }
		public string DatabaseName { get; set; }
	}
}