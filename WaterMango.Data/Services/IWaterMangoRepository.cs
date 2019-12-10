using System.Collections.Generic;
using WaterMango.Data.Entities;

namespace WaterMango.Data.Services
{
    public interface IWaterMangoRepository
    {
        Plant GetPlant(int id);
        IEnumerable<Plant> GetPlants();
        bool Save();
    }
}