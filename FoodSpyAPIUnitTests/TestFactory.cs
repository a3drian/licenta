
using System;
using System.Collections.Generic;
using MongoDB.Bson;
using FoodSpyAPI.DTOs.Models;
using FoodSpyAPI.Models;

namespace FoodSpyAPIUnitTests
{
	public static class TestCaseFactory
	{
		#region Constants

		public const string BAD_EMAIL = "BAD_EMAIL";
		public const string GOOD_EMAIL = "adi@foodspy.com";

		public const string BAD_MEAL_ID = "12345678-1234-1234-1234-123456789012";
		public const string GOOD_MEAL_ID = "fee45c47-4ed3-4448-8fed-21221d2dd92d";

		public static Guid GOOD_GUID = new Guid(GOOD_MEAL_ID);
		public static Guid BAD_GUID = new Guid(BAD_MEAL_ID);

		public const string GOOD_SID = GOOD_MEAL_ID;
		public const string BAD_SID = BAD_MEAL_ID;

		#endregion

		public static object[] InvalidIDs =
		{
			new object[] { "" },
			new object[] { " " },
			new object[] { "\t" },
			new object[] { "\n" },
			new object[] { "a" },
			new object[] { "1" },
			new object[] { "a1" },
			new object[] { "abc" },
			new object[] { "123" },
			new object[] { "abc123" }
		};

		public static object[] ValidIDs =
		{
			new object[] { "bb81d0e7-001a-4754-bf35-65d26a75160c" },
			new object[] { "1d939b21-1a7b-4fbe-8808-d7fff483bc00" },
			new object[] { "d1b60339-a473-4e07-82a3-d754f81791aa" },
			new object[] { "a9693105-4e04-4526-87f1-e66d640cfda6" },
			new object[] { "623be7a3-889d-4844-95b5-3d1466546224" },
			new object[] { "54f1cef7-f08c-4a95-8ab2-23081f8ee591" },
			new object[] { "a47b023e-33ff-4e0b-8b4e-e7d2a11d7050" },
			new object[] { "c6ecec02-6ad7-4367-821f-ced30edefbcc" },
			new object[] { "7f8f720f-4553-4c3c-8e08-5f2727bee5a5" },
			new object[] { "32423cba-a164-4b1a-9127-caac67d733db" }
		};

		public static object[] InvalidIntakes =
		{
				new object[] { new Intake() },
				new object[] { new Intake { } },
				new object[] { new Intake { Email = BAD_EMAIL } },
				new object[] { new Intake { Email = GOOD_EMAIL } },

				new object[] {
						new Intake
						{
							Email = BAD_EMAIL,
							MealIDs = new List<Guid> { GOOD_GUID }
						}
					},


				new object[] {
						new Intake
						{
							Email = GOOD_EMAIL,
							MealIDs = new List<Guid> { BAD_GUID }
						}
					}
		};

		public static object[] InvalidIntakeModels =
		{
				new object[] { new IntakeModel() },
				new object[] { new IntakeModel { } },
				new object[] { new IntakeModel { Email = BAD_EMAIL } },
				new object[] { new IntakeModel { Email = GOOD_EMAIL } },

				new object[] {
						new IntakeModel
						{
							Email = BAD_EMAIL,
							MealIDs = new List<Guid> { GOOD_GUID }
						}
					},


				new object[] {
						new IntakeModel
						{
							Email = GOOD_EMAIL,
							MealIDs = new List<Guid> { BAD_GUID }
						}
					}
		};

		public static object[] InvalidIntakesAndIntakeModels =
		{
				new object[]{ new Intake(), new IntakeModel() },
				new object[]{ new Intake { }, new IntakeModel { } },
				new object[]{ new Intake { Email = BAD_EMAIL }, new IntakeModel { Email = BAD_EMAIL } },
				new object[]{ new Intake { Email = GOOD_EMAIL }, new IntakeModel { Email = GOOD_EMAIL }} ,

				new object[]{
						new Intake
						{
							Email = BAD_EMAIL,
							MealIDs = new List<Guid> { GOOD_GUID }
						},
						new IntakeModel
						{
							Email = BAD_EMAIL,
							MealIDs = new List<Guid> { GOOD_GUID }
						}
					},

				new object[]{
						new Intake
						{
							Email = GOOD_EMAIL,
							MealIDs = new List<Guid> { BAD_GUID }
						},
						new IntakeModel
						{
							Email = GOOD_EMAIL,
							MealIDs = new List<Guid> { BAD_GUID }
						}
					}
		};

		#region Helper methods

		public static Intake GetTestIntakeWithId(string id)
		{
			Intake intake = new Intake
			{
				Id = Guid.Parse(id),
				Email = GOOD_EMAIL,
				CreatedAt = new DateTime(2021, 5, 25),
				MealIDs = new List<Guid>() { GOOD_GUID }
			};

			return intake;
		}

		public static IntakeModel GetTestIntakeModelWithId(string id)
		{
			IntakeModel intake = new IntakeModel
			{
				Id = new Guid(id),
				Email = GOOD_EMAIL,
				CreatedAt = new DateTime(2021, 5, 25),
				MealIDs = new List<Guid>() { GOOD_GUID }
			};

			return intake;
		}

		#endregion

	}
}
