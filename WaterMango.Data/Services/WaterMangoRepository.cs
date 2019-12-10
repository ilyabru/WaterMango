using System;
using System.Collections.Generic;
using System.Linq;
using WaterMango.Data.Entities;

namespace WaterMango.Data.Services
{
    public class WaterMangoRepository : IWaterMangoRepository
    {
        private readonly WaterMangoContext _context;

        public WaterMangoRepository(WaterMangoContext context)
        {
            _context = context;
        }

        public IEnumerable<Plant> GetPlants()
        {
            return _context.Plants.ToList();
        }

        public Plant GetPlant(int id)
        {
            if (id == default)
            {
                throw new ArgumentNullException(nameof(id));
            }

            return _context.Plants.FirstOrDefault(p => p.PlantId == id);
        }

        public bool Save()
        {
            return _context.SaveChanges() >= 0;
        }
    }
}
