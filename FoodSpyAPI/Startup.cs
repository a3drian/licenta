
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using FoodSpyAPI.Controllers;
using FoodSpyAPI.Services;
using FoodSpyAPI.Settings;

namespace FoodSpyAPI
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
		public void ConfigureServices(IServiceCollection services)
		{
			// AutoMapper
			services.AddAutoMapper(typeof(MealsController));
			services.AddAutoMapper(typeof(FoodsController));

			// Databases
			// requires using Microsoft.Extensions.Options
			// Meals database
			services.Configure<MealsDatabaseSettings>(
				 Configuration.GetSection(nameof(MealsDatabaseSettings)));

			services.AddSingleton<IMealsDatabaseSettings>(sp =>
				 sp.GetRequiredService<IOptions<MealsDatabaseSettings>>().Value);

			// Services
			services.AddSingleton<MealService>();

			// Foods database
			services.Configure<FoodsDatabaseSettings>(
				Configuration.GetSection(nameof(FoodsDatabaseSettings)));

			services.AddSingleton<IFoodsDatabaseSettings>(sp =>
				sp.GetRequiredService<IOptions<FoodsDatabaseSettings>>().Value);

			// Services
			services.AddSingleton<FoodService>();

			// CORS
			services.AddCors(options =>
				{
					options.AddPolicy(
						 name: "CorsPolicy",
						 configurePolicy: builder =>
						 {
							 builder
									.AllowAnyOrigin()
									.AllowAnyMethod()
									.AllowAnyHeader();
						 }
					);
				});

			services.AddControllers();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment()) {
				app.UseDeveloperExceptionPage();
			}

			app.UseRouting();

			app.UseCors("CorsPolicy");

			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
				 {
					 endpoints.MapControllers();
				 }
			);
		}
	}
}
