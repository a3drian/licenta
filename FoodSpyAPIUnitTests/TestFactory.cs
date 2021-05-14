
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

		public const string BAD_MEAL_ID = "123456789987654321123456";
		public const string GOOD_MEAL_ID = "608ad9df65614f54f0859c39";

		public static ObjectId GOOD_OID = new ObjectId(GOOD_MEAL_ID);
		public static ObjectId BAD_OID = new ObjectId(BAD_MEAL_ID);

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
			new object[] { "606888685727537f425277cf" },
			new object[] { "6068886e5727537f425277d0" },
			new object[] { "606888795727537f425277d2" },
			new object[] { "606888725727537f425277d1" },
			new object[] { "6068616630494d22f260b234" },
			new object[] { "60636d2c6dc1cc04409b4909" },
			new object[] { "60649872d9bc9a2e9436cacc" },
			new object[] { "60649877d9bc9a2e9436cacd" },
			new object[] { "60649887d9bc9a2e9436cace" },
			new object[] { "60804088dad7f5268095cdb1" }
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
							MealIDs = new List<ObjectId> { GOOD_OID }
						}
					},


				new object[] {
						new Intake
						{
							Email = GOOD_EMAIL,
							MealIDs = new List<ObjectId> { BAD_OID }
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
							MealIDs = new List<string> { GOOD_SID }
						}
					},


				new object[] {
						new IntakeModel
						{
							Email = GOOD_EMAIL,
							MealIDs = new List<string> { BAD_SID }
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
							MealIDs = new List<ObjectId> { GOOD_OID }
						},
						new IntakeModel
						{
							Email = BAD_EMAIL,
							MealIDs = new List<string> { GOOD_SID }
						}
					},

				new object[]{
						new Intake
						{
							Email = GOOD_EMAIL,
							MealIDs = new List<ObjectId> { BAD_OID }
						},
						new IntakeModel
						{
							Email = GOOD_EMAIL,
							MealIDs = new List<string> { BAD_SID }
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
				MealIDs = new List<ObjectId>() { GOOD_OID }
			};

			return intake;
		}

		public static IntakeModel GetTestIntakeModelWithId(string id)
		{
			IntakeModel intake = new IntakeModel
			{
				Id = id,
				Email = GOOD_EMAIL,
				CreatedAt = new DateTime(2021, 5, 25),
				MealIDs = new List<string>() { GOOD_SID }
			};

			return intake;
		}

		#endregion

	}
}
