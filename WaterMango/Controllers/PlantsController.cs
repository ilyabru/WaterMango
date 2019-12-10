using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WaterMango.Data.Entities;
using WaterMango.Data.Services;

namespace WaterMango.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlantsController : ControllerBase
    {
        private readonly IWaterMangoRepository _repo;
        private readonly ILogger<PlantsController> _logger;

        public PlantsController(IWaterMangoRepository repo, 
                                ILogger<PlantsController> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Plant>> GetPlants()
        {
            var plantsFromRepo = _repo.GetPlants();

            return Ok(plantsFromRepo);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Plant>> WaterPlant(int id, CancellationToken cancellationToken)
        {
            var plantToWater = _repo.GetPlant(id);

            if (plantToWater == null)
            {
                return NotFound();
            }

            // The 30 seconds timeout check.
            if (!TryValidateModel(plantToWater))
            {
                return ValidationProblem(ModelState);
            }

            // the cancellationToken enables termination of this request if the users clicks stop button or refreshes the browser.
            await WaterPlant(plantToWater, cancellationToken);

            plantToWater.LastWateredDate = DateTime.Now;

            // the plantsToWater entity is tracked, so changing the date and saving changes will update the database
            _repo.Save();

            return Ok(plantToWater);
        }

        private async Task WaterPlant(Plant plant, CancellationToken cancellationToken)
        {
            // Simulating work. We would probably call a microcontroller service here.
            _logger.LogInformation("Started Watering the {plantName}(id = {plantId}) plant.", plant.Name, plant.PlantId);

            await Task.Delay(10000, cancellationToken);

            _logger.LogInformation("Stopped Watering the {plantName}(id = {plantId}) plant.", plant.Name, plant.PlantId);
        }
    }
}
