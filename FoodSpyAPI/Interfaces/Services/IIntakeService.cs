
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FoodSpyAPI.Common;
using FoodSpyAPI.Models;

namespace FoodSpyAPI.Interfaces.Services
{
	public interface IIntakeService
	{
		public Task<List<Intake>> GetIntakes();

		public Task<Intake> GetIntakeById(string id);

		public Task<Intake> AddIntake(Intake intake);

		public Task<bool> UpdateIntake(Intake intake);

		public Task<bool> DeleteIntake(Intake intake);

		public Task<List<Intake>> SearchIntakesByEmail(string email, SortOrder sortOrder);

		public Task<Intake> SearchIntakeByEmailAndDate(string email, DateTime createdAt);

	}
}